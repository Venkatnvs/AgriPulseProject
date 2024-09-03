from rest_framework import serializers

class DashboardDataSerializer(serializers.Serializer):
    fields = serializers.IntegerField()
    devices = serializers.IntegerField()
    sensors_readings = serializers.IntegerField()
    sensors = serializers.IntegerField()