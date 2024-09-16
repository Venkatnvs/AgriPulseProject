from django.urls import path
from .views import SendPushNotificationView, UserFCMTokenView

urlpatterns = [
    path('send-push-notification/', SendPushNotificationView.as_view(), name='utils-send-push-notification'),

    path('fcm-token/', UserFCMTokenView.as_view(), name='fcm-token'),
]