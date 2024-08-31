from django.contrib import admin
from .models import SoilSensor,Device

admin.site.register(Device)
admin.site.register(SoilSensor)