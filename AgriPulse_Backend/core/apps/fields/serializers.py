from rest_framework import serializers
from .models import Field
from core.apps.sensors.models import Device

class FieldSerializer(serializers.ModelSerializer):
    main_coordinate = serializers.SerializerMethodField()
    map_tile_url = serializers.SerializerMethodField()
    linked_devices = serializers.SerializerMethodField()

    class Meta:
        model = Field
        fields = ['id', 'user', 'name', 'description', 'crop_type', 'geometry', 'size', 'created_at', 'updated_at', 'main_coordinate', 'map_tile_url', 'linked_devices']
        read_only_fields = ['id' ,'user', 'created_at', 'updated_at', 'main_coordinate', 'map_tile_url', 'linked_devices']

    def get_main_coordinate(self, obj):
        return obj.main_coordinate
    
    def get_map_tile_url(self, obj):
        return obj.google_maps_url
    
    def get_linked_devices(self, obj):
        return obj.devices.exists() and obj.devices.first().id

    def validate_user(self, value):
        if value != self.context['request'].user:
            raise serializers.ValidationError("You can't create fields for other users")
        return value

    def validate(self, data):
        user=self.context['request'].user
        if 'name' in data:
            if Field.objects.filter(name=data['name'], user=user).exists():
                raise serializers.ValidationError("Field with this name already exists")
        return data
    
class WeatherAndForecastSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lon = serializers.FloatField()

    def validate_lat(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value
    
    def validate_lon(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value

class FieldListSelectSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(source='id')
    label = serializers.CharField(source='name')
    
    class Meta:
        model = Field
        fields = ['value', 'label' ]

class FieldLinkToDeviceSerializer(serializers.Serializer):
    device_id = serializers.IntegerField()

    def validate_device_id(self, value):
        if not self.context['request'].user:
            raise serializers.ValidationError("User not found")
        if not Device.objects.filter(id=value, user=self.context['request'].user).exists():
            raise serializers.ValidationError("Device not found")
        return value