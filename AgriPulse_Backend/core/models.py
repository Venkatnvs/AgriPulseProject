from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Field(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='land_fields')
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.IntegerField()
    location = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.email}"