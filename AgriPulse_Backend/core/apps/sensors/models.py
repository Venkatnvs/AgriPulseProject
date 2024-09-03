from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.core.exceptions import ValidationError
from core.apps.fields.models import Field

User = get_user_model()

class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    fields = models.ManyToManyField(Field, related_name='devices')
    device_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    access_token = models.CharField(max_length=255, unique=True, null=True, blank=True)
    configurations = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_configured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.pk and self.fields.exists():
            self.validate_fields_belong_to_user()
        if not self.access_token:
            self.access_token = self.generate_access_token()
        super().save(*args, **kwargs)

    def validate_fields_belong_to_user(self):
        for field in self.fields.all():
            if field.user != self.user:
                raise ValidationError(f"The field '{field.name}' does not belong to the user '{self.user.email}'.")

    def generate_access_token(self):
        token = uuid.uuid4().hex
        return f"pk-nvs-={token}="
    class Meta:
        ordering = ('-created_at',)
        unique_together = ('user', 'name')

    @property
    def get_sensor_count_from_configurations(self):
        if not self.configurations:
            return 0
        return self.configurations.get('soil_sensors_count', 0)
    
    def __str__(self):
        return f"Device {self.device_id} for {self.user.email}"

class SoilSensor(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='soil_sensors')
    temperature = models.FloatField(null=True, blank=True)  
    humidity = models.FloatField(null=True, blank=True)
    soil_moisture = models.JSONField(null=True, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    npk = models.JSONField(null=True, blank=True)
    ph = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sensor data for {self.device.user} on {self.timestamp}"

    def get_average_soil_moisture(self):
        """
            soil_moisture: {
                "s1": 10,
                "s2": 20,
                "s3": 30,
                ....
            }
        """
        moisture_values = self.soil_moisture.values()
        return sum(moisture_values) / len(moisture_values) if moisture_values else 0