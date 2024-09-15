from rest_framework import serializers
from .models import UserFCMToken

class pushNotificationSerializer(serializers.Serializer):
    token = serializers.CharField()
    title = serializers.CharField()
    body = serializers.CharField()

    def validate(self, data):
        if 'token' not in data:
            raise serializers.ValidationError("Token is required")
        if 'title' not in data:
            raise serializers.ValidationError("Title is required")
        if 'body' not in data:
            raise serializers.ValidationError("Body is required")
        return data
    
class UserFCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFCMToken
        fields = ['fcm_token']