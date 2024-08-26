from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    UserView, 
    CustomTokenObtainPairView,
    VerifyOTPView,
    SendOTPView,
    ForgotPasswordView,
    ResetPasswordView,
    VerifyResetPasswordRequestView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='accounts-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='accounts-token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='accounts-token_refresh'),
    path('user/', UserView.as_view(), name='accounts-user_detail'),

    path('verify-otp/', VerifyOTPView.as_view(), name='accounts-verify_otp'),
    path('send-otp/', SendOTPView.as_view(), name='accounts-resend_otp'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='accounts-forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='accounts-reset_password'),
    path('verify-reset-password-request/', VerifyResetPasswordRequestView.as_view(), name='accounts-verify_reset_password_request'),
]