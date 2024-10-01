import firebase_admin
from firebase_admin import credentials, messaging
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from .serializers import pushNotificationSerializer, UserFCMTokenSerializer
from django.conf import settings
from .models import UserFCMToken
from django.shortcuts import get_object_or_404
import os

cred = credentials.Certificate(
    os.path.join(settings.BASE_DIR, 'krishi-pragya-firebase-adminsdk-g57d9-1a252d7be6.json')
)
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body, click_action_url, image_url=None):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
            image=image_url,
        ),
        token=token,
        webpush=messaging.WebpushConfig(
            notification=messaging.WebpushNotification(
                title=title,
                body=body,
                icon=f'{settings.FRONTEND_URL}/small_logo.png',
                image=image_url,
            ),
            data={
                "click_action": click_action_url
            }
        ),
        android=messaging.AndroidConfig(
            notification=messaging.AndroidNotification(
                title=title,
                body=body,
                icon='small_icon',
                image=image_url,
                color='#f45342',
                click_action='CAPACITOR_NOTIFICATION_CLICK',
            ),
            priority='high',
        )
    )
    response = messaging.send(message)
    return response

class SendPushNotificationView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = pushNotificationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        
        token = serializer.validated_data['token']
        title = serializer.validated_data['title']
        body = serializer.validated_data['body']

        try:
            response = send_push_notification(token, title, body, settings.FRONTEND_URL)
            return Response({'message': 'Notification sent!', 'response': response, 'status': status.HTTP_200_OK})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UserFCMTokenView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserFCMTokenSerializer

    def get(self, request):
        user = request.user
        user_token = get_object_or_404(UserFCMToken, user=user)
        return Response({'fcm_token': user_token.fcm_token}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        
        token = serializer.validated_data['fcm_token']
        user = request.user
        try:
            user_token, created = UserFCMToken.objects.get_or_create(user=user)
            user_token.fcm_token = token
            user_token.save()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Token saved!', 'status': status.HTTP_200_OK})
    
class ServerStatusView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({'message': 'Server is up and running!', 'status': status.HTTP_200_OK})