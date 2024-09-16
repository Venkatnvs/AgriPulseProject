from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class UserFCMToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fcm_token = models.CharField(max_length=255)
    last_updated = models.DateTimeField(auto_now=True)
    last_notified = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email}'s FCM Token"