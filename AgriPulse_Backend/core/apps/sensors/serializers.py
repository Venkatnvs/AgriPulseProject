from rest_framework import serializers
from .models import SoilSensor, Device

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ('user', 'access_token', 'is_active', 'is_configured', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        new_validated_data = validated_data.copy()
        new_validated_data.pop('user', None)
        device = Device.objects.create(user=user, **new_validated_data)
        return device
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
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
        print(self.context['request'].current_device)
        device = self.context['request'].current_device
        new_validated_data = validated_data.copy()
        new_validated_data.pop('user', None)
        print(new_validated_data, validated_data)
        sensor_data = SoilSensor.objects.create(device=device, **new_validated_data)
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