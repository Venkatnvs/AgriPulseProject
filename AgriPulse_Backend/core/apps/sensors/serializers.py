from rest_framework import serializers
from .models import SoilSensor, Device
from core.apps.fields.serializers import FieldSerializer
from core.apps.fields.models import Field
from utils.views import send_push_notification
from django.conf import settings
from utils.models import UserFCMToken
from datetime import timedelta
import os
import csv
import threading

file_path = os.path.join(settings.BASE_DIR, 'datasets', 'crop_data.csv')

def should_notify(sensor_data, user):
    crop_thresholds = 50
    if user is None or user.userfcmtoken is None:
        return False

    fcm_token = user.userfcmtoken.fcm_token
    last_notified = user.userfcmtoken.last_notified

    if fcm_token is None:
        return False
    
    crop_type = sensor_data.device.fields.first().crop_type

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row['CROP']
            level = row['Level or Growth']
            csv_crop_type = f"{name} ({level})"
            lower_percent_value = float(row['Lower % Value'].strip('%')) or 0
            upper_percent_value = float(row['Upper % value'].strip('%')) or 100
            avg_brack_point = (lower_percent_value + upper_percent_value) / 2
            if csv_crop_type == crop_type:
                crop_thresholds = avg_brack_point
                break

    time_since_last_notification = sensor_data.timestamp - (last_notified or sensor_data.timestamp - timedelta(minutes=settings.SOIL_MOISTURE_NOTIFICATION_DELTA + 1))
    should_notify = (sensor_data.get_average_soil_moisture() < crop_thresholds) and time_since_last_notification > timedelta(minutes=settings.SOIL_MOISTURE_NOTIFICATION_DELTA)

    return should_notify

def notify_user(sensor_data, user):
    if should_notify(sensor_data, user):
        send_push_notification(
            user.userfcmtoken.fcm_token,
            'Need to water !',
            f"Soil moisture is low in {sensor_data.device.name}.",
            settings.FRONTEND_URL
        )
        user.userfcmtoken.last_notified = sensor_data.timestamp
        user.userfcmtoken.save()

class DeviceSerializer(serializers.ModelSerializer):
    fields_data = FieldSerializer(many=True, read_only=True, source='fields', required=False)
    fields = serializers.PrimaryKeyRelatedField(queryset=Field.objects.all(), many=True, required=False)

    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ('user', 'access_token', 'is_active', 'is_configured', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        new_validated_data = validated_data.copy()
        new_validated_data.pop('user', None)
        new_validated_data.pop('fields', None)
        device = Device.objects.create(user=user, **new_validated_data)
        return device
    
    def update(self, instance, validated_data):
        fields = validated_data.pop('fields', None)
        instance = super().update(instance, validated_data)
        if fields is not None:
            instance.fields.set(fields)
            # instance.is_configured = True
            instance.save()
        return instance
    
    def validate(self, attrs):
        user=self.context['request'].user
        if 'device_id' in attrs:
            if Device.objects.filter(device_id=attrs['device_id']).exists():
                raise serializers.ValidationError("Device with this device_id already exists.")
        if 'name' in attrs:
            if Device.objects.filter(name=attrs['name'], user=user).exists():
                raise serializers.ValidationError("Device with this name already exists for this user.")
        return attrs

class SoilSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilSensor
        fields = '__all__'
        read_only_fields = ('device', 'timestamp')

    def create(self, validated_data):
        device = self.context['request'].current_device
        new_validated_data = validated_data.copy()
        user = new_validated_data.pop('user', None)
        sensor_data = SoilSensor.objects.create(device=device, **new_validated_data)

        thread = threading.Thread(target=notify_user, args=(sensor_data, user))
        thread.start()
        
        return sensor_data
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['average_soil_moisture'] = instance.get_average_soil_moisture()
        return data
    
class DeviceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name']