from rest_framework import serializers
from .models import SoilSensor


class SoilSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilSensor
        fields = '__all__'
        read_only_fields = ('user', 'timestamp')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        if instance.user != user:
            raise serializers.ValidationError("You don't have permission to update this data.")
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['average_soil_moisture'] = instance.get_average_soil_moisture()
        return data