from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError as DjangoValidationError
from .utils import extract_first_last_name
from django.core.validators import validate_email
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .utils import CustomPasswordResetTokenGenerator,send_reset_password_email

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'first_name', 'last_name', 'phone_number', 'is_active', 'role', 'is_staff', 'is_superuser', 'is_otp_verified', 'is_completed', 'is_socialaccount', 'date_joined', 'last_login')

    get_full_name = lambda self, obj: obj.get_full_name()

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'full_name', 'phone_number', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        try:
            validate_email(value)
            return value
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        
    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number is already in use.")
        if not value[1:].isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits.")
        return value

    def create(self, validated_data):
        first_name, last_name = extract_first_last_name(validated_data['full_name'])
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            phone_number=validated_data['phone_number'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_completed=True,
            is_active=True
        )
        return user

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError('Invalid credentials')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            if not user.is_otp_verified:
                raise serializers.ValidationError('User account is not verified.')
            
            user.last_login = timezone.now()
            user.save()
            
            refresh = RefreshToken.for_user(user)
            return {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active,
                'is_otp_verified': user.is_otp_verified,
                'is_completed': user.is_completed,
                'is_socialaccount': user.is_socialaccount,
                'full_name': user.get_full_name(),
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

            }
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        if not email or not otp:
            raise serializers.ValidationError("Email and OTP are required.")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")
        if user.is_otp_verified:
            raise serializers.ValidationError("User account is already verified.")
        if not user.otp_metadata:
            raise serializers.ValidationError("No OTP request found. Please request a new OTP.")
        # Check if OTP is Expired
        created_at, _, _ = user.otp_metadata.split(':')
        created_at = float(created_at)
        if timezone.now().timestamp() > created_at + 600:
            raise serializers.ValidationError("OTP has expired. Please request a new OTP.")
        # Check if OTP is Valid
        if user.is_otp_valid(otp):
            user.is_otp_verified = True
            user.save()
            attrs['user'] = user
            return attrs
        else:
            attempts_left = 5 - int(user.otp_metadata.split(':')[1]) if user.otp_metadata else 5
            responce_message = f"Invalid or expired OTP. You have {attempts_left} attempts left."
            if attempts_left == 0:
                responce_message = "You have exceeded the maximum number of attempts. Please request a new OTP."
            raise serializers.ValidationError(responce_message)
        
class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email')
        if not email:
            raise serializers.ValidationError("Email is required.")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")
        if user.is_otp_verified:
            raise serializers.ValidationError("User account is already verified.")
        if not user.can_resend_otp():
            if user.otp_metadata:
                created_at, _, _ = user.otp_metadata.split(':')
                created_at = float(created_at)
            else:
                created_at = timezone.now().timestamp()
            time_passed = timezone.now().timestamp() - created_at
            time_left = int(max(60 - time_passed, 0))
            raise serializers.ValidationError(f"You can only request a new OTP after {time_left} seconds.")
        attrs['user'] = user
        return attrs
    
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email')
        if not email:
            raise serializers.ValidationError("Email is required.")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        if not user.is_otp_verified:
            raise serializers.ValidationError("User account is not verified.")
        attrs['user'] = user
        return attrs
    
    def create(self, validated_data):
        user = validated_data.get('user')
        token = CustomPasswordResetTokenGenerator().make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        print(user, uidb64, token)
        try:
            send_reset_password_email(user, uidb64, token)
        except Exception:
            raise serializers.ValidationError({"detail": "Failed to send reset password email."})
        return validated_data
    
class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate(self, attrs):
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')
        new_password = attrs.get('new_password')
        if not uidb64 or not token or not new_password:
            raise serializers.ValidationError("UIDB64, token, and new password are required.")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or UIDB64.")
        attrs['user'] = user
        if not CustomPasswordResetTokenGenerator().check_token(attrs.get('user'), token):
            raise serializers.ValidationError("Invalid, expired, or too many attempts on the token.")
        return attrs
    
    def save(self, **kwargs):
        user = self.validated_data.get('user')
        user.set_password(self.validated_data.get('new_password'))
        user.save()
        return user
    
class VerifyResetPasswordRequestSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')
        if not uidb64 or not token:
            raise serializers.ValidationError("UIDB64 and token are required.")
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or UIDB64.")
        attrs['user'] = user
        if not CustomPasswordResetTokenGenerator().check_token(attrs.get('user'), token):
            raise serializers.ValidationError("Invalid, expired, or too many attempts on the token.")
        return attrs