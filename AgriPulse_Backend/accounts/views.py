from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    CustomTokenObtainPairSerializer, 
    VerifyOTPSerializer,
    SendOTPSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    VerifyResetPasswordRequestSerializer
)
from rest_framework.exceptions import ValidationError, PermissionDenied
from .utils import send_otp_email

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        self.perform_create(serializer)
        user = User.objects.get(email=serializer.data['email'])
        self.perform_otp_generation(user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_otp_generation(self, user):
        otp_raw = user.generate_otp()
        try:
            send_otp_email(user, otp_raw)
        except Exception:
            raise ValidationError({"detail": "Failed to send OTP email."})

class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class VerifyOTPView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        responce_data = {
            "data": serializer.data,
            "detail": "OTP verified successfully."
        }
        return Response(responce_data, status=status.HTTP_200_OK)
        
class SendOTPView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SendOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        user = serializer.validated_data.get('user')
        otp_raw = user.generate_otp()
        try:
            send_otp_email(user, otp_raw)
        except Exception:
            raise ValidationError({"detail": "Failed to send OTP email."})
        responce_data = {
            "data": {
                "email": user.email,
                "resend_otp": "Available after 60 seconds.",
                "resend_attempts_left": 4 - int(user.otp_metadata.split(':')[2]) if user.otp_metadata else 0
            },
            "detail": "OTP resent successfully."
        }
        return Response(responce_data, status=status.HTTP_200_OK)
    
class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        serializer.save()
        responce_data = {
            "data": {
                "email": serializer.validated_data.get('user').email,
                "reset_password": "Reset password email is valid for 10 minutes."
            },
            "detail": "Reset password email sent successfully."
        }
        return Response(responce_data, status=status.HTTP_200_OK)
    
class ResetPasswordView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        serializer.save()
        responce_data = {
            "data": serializer.data,
            "detail": "Password reset successfully."
        }
        return Response(responce_data, status=status.HTTP_200_OK)
    
class VerifyResetPasswordRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        responce_data = {
            "data": serializer.data,
            "detail": "Reset password request verified successfully."
        }
        return Response(responce_data, status=status.HTTP_200_OK)