from django.core.mail import EmailMessage
from django.conf import settings
import threading
from django.contrib.auth import get_user_model
from .email_templates import reset_password_template, otp_email_template
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone

User = get_user_model()

def extract_first_last_name(full_name):
    if not full_name:
        return "", ""
    parts = full_name.split()
    first_name = parts[0]
    last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
    return first_name, last_name

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    # Expiry time in seconds (10 minutes)
    token_expiry = 600

    def make_token(self, user):
        user.token_created_time = timezone.now().timestamp()
        return super().make_token(user)
    
    def check_token(self, user, token):
        if hasattr(user, 'token_created_time'):
            if timezone.now().timestamp() > user.token_created_time + self.token_expiry:
                return False
        return super().check_token(user, token)

class EmailThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send(fail_silently=True)

def send_email(subject, message, recipient_list, content_subtype =None):
    from_email = settings.DEFAULT_FROM_EMAIL
    email = EmailMessage(
        subject, 
        message, 
        from_email, 
        recipient_list
    )
    if content_subtype in ['html', 'plain']:
        email.content_subtype = content_subtype
    EmailThread(email).start()

def send_otp_email(user, otp):
    subject = 'Your OTP Code'
    message = otp_email_template.format(
        full_name=user.full_name,
        otp=otp,
        site_name=settings.SITE_NAME
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
    send_email(subject, message, recipient_list, content_subtype='plain')

def send_reset_password_email(user, uidb64, token):
    subject = 'Reset Password'
    message = reset_password_template.format(
        full_name=user.full_name,
        reset_password_url=f'{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}',
        site_name=settings.SITE_NAME
    )
    recipient_list = [user.email]
    send_email(subject, message, recipient_list, content_subtype='plain')