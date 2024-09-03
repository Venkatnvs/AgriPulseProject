from rest_framework import serializers

class DashboardDataSerializer(serializers.Serializer):
    fields = serializers.IntegerField()
    devices = serializers.IntegerField()
    sensors_readings = serializers.IntegerField()
    sensors = serializers.IntegerField()

class SoilSensorChartSerializer(serializers.Serializer):
    date = serializers.DateField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()
    avg_soil_moisture = serializers.FloatField()

    class Meta:
        fields = ['date', 'temperature', 'humidity', 'avg_soil_moisture']

class DeviceAndFieldByMonthSerializer(serializers.Serializer):
    month = serializers.CharField()
    devices = serializers.IntegerField()
    fields = serializers.IntegerField()
    devices_increase_percentage = serializers.FloatField(required=False)
    fields_increase_percentage = serializers.FloatField(required=False)

class FieldsByCropTypeSerializer(serializers.Serializer):
    crop_type = serializers.CharField()
    count = serializers.IntegerField()

class AggregatedMainGraphsSerializer(serializers.Serializer):
    chart1 = SoilSensorChartSerializer(many=True)
    chart2 = DeviceAndFieldByMonthSerializer(many=True)
    chart3 = FieldsByCropTypeSerializer(many=True)