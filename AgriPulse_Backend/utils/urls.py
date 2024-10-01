from django.urls import path
from .views import SendPushNotificationView, UserFCMTokenView, ServerStatusView

urlpatterns = [
    path('send-push-notification/', SendPushNotificationView.as_view(), name='utils-send-push-notification'),

    path('fcm-token/', UserFCMTokenView.as_view(), name='fcm-token'),

    path('server-status/', ServerStatusView.as_view(), name='server-status'),
]