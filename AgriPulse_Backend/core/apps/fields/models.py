from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Field(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='land_fields')
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True, null=True)
    crop_type = models.CharField(max_length=100)
    geometry = models.JSONField() # GeoJSON
    size = models.FloatField(help_text="Size of the field in acres")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.name} - {self.user.email}"
    
    def get_representative_coordinate(self):
        if not self.geometry:
            return None
        try:
            if isinstance(self.geometry, dict):
                lat, lng = self.geometry['coordinates'][0][0]
            else:
                lat, lng = self.geometry[0][0]
        except (KeyError, IndexError):
            return None
        return lat, lng
    
    @property
    def main_coordinate(self):
        return self.get_representative_coordinate()