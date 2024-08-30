from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SoilSensor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soil_sensor_data')
    temperature = models.FloatField(null=True, blank=True)  
    humidity = models.FloatField(null=True, blank=True)
    soil_moisture = models.JSONField(null=True, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sensor data for {self.user.username} on {self.timestamp}"

    def get_average_soil_moisture(self):
        moisture_values = self.soil_moisture.values()
        return sum(moisture_values) / len(moisture_values) if moisture_values else 0