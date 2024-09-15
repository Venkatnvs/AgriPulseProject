from rest_framework import serializers
from .models import SoilSensor, Device
from core.apps.fields.serializers import FieldSerializer
from core.apps.fields.models import Field
from utils.views import send_push_notification
from django.conf import settings
from utils.models import UserFCMToken
from datetime import timedelta

def should_notify(sensor_data, user):
    if user is None or user.userfcmtoken is None:
        return False

    fcm_token = user.userfcmtoken.fcm_token
    last_notified = user.userfcmtoken.last_notified

    if fcm_token is None:
        return False

    time_since_last_notification = sensor_data.timestamp - (last_notified or sensor_data.timestamp - timedelta(minutes=11))
    should_notify = (sensor_data.get_average_soil_moisture() < 50) and time_since_last_notification > timedelta(minutes=10)

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

        try:
            notify_user(sensor_data, user)
        except Exception as e:
            print(e)
        
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