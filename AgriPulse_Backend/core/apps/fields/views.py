from rest_framework import generics, permissions, filters, serializers, status
from .models import Field
from .serializers import (
    FieldSerializer, 
    WeatherAndForecastSerializer, 
    FieldListSelectSerializer, 
    FieldLinkToDeviceSerializer,
    CropsDataSerializer,
    DeviceBasedFieldsCropTypeSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from .filters import FieldFilter
from rest_framework.response import Response
import requests
from django.conf import settings
from core.apps.sensors.models import Device
from django.db.models import Q
import os
import csv
from django.core.cache import cache

class FieldListCreate(generics.ListCreateAPIView):
    serializer_class = FieldSerializer
    permission_classes = [ permissions.IsAuthenticated ]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FieldFilter
    search_fields = ['name', 'crop_type']

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Field.objects.none()
        return Field.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class FieldRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Field.objects.none()
        return Field.objects.filter(user=self.request.user)

class WeatherAndForecast(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WeatherAndForecastSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as exc:
            return Response({"errors": exc.detail}, status=exc.status_code)
        
        lat = serializer.validated_data['lat']
        lon = serializer.validated_data['lon']

        weather_data = self.get_weather_for_lat_lng(lat, lon)
        forecast_data = self.get_forecast_for_lat_lng(lat, lon)

        response_data = {
            'weather': weather_data,
            'forecast': forecast_data,
            'coordinates': {
                'lat': lat,
                'lon': lon
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
    def call_weather_api(self, lat, lon, endpoint):
        url = f'https://api.agromonitoring.com/agro/1.0/{endpoint}'
        params = {
            'lat': lat,
            'lon': lon,
            'units': 'metric',
            'appid': settings.AGROMONITORING_API_KEY
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            return {
                "error": "Unable to fetch data",
                "status_code": response.status_code
            }
        
    def get_weather_for_lat_lng(self, lat, lon):
        return self.call_weather_api(lat, lon, 'weather')
    
    def get_forecast_for_lat_lng(self, lat, lon):
        return self.call_weather_api(lat, lon, 'weather/forecast')

class FieldListSelect(generics.ListAPIView):
    serializer_class = FieldListSelectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Field.objects.none()
        current_device = self.kwargs.get('device_id')
        return Field.objects.filter(
            user=self.request.user
        ).filter(
            Q(devices__isnull=True) | Q(devices=current_device)
        )
class FieldDeviceLinkView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldLinkToDeviceSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Field.objects.none()
        return Field.objects.filter(user=self.request.user)

    def post(self, request, pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        device_id = serializer.validated_data['device_id']
        try:
            field = Field.objects.get(pk=pk, user=request.user)
        except Field.DoesNotExist:
            return Response({"errors": "Field not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            device = Device.objects.get(id=device_id, user=request.user)
        except Device.DoesNotExist:
            return Response({"errors": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        if field.devices.filter(id=device_id).exists():
            return Response({"errors": "Device already linked"}, status=status.HTTP_400_BAD_REQUEST)
        field.devices.add(device)
        return Response({"message": "Device linked successfully"}, status=status.HTTP_200_OK)

class CropsDataView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated ]
    serializer_class = CropsDataSerializer

    def load_crop_data(self):
        file_path = os.path.join(settings.BASE_DIR, 'datasets', 'crop_data.csv')
        data = []

        with open(file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                name = row['CROP']
                level = row['Level or Growth']
                lower_percent_value = float(row['Lower % Value'].strip('%'))
                upper_percent_value = float(row['Upper % value'].strip('%'))
                lower_sensor_value = float(row['Lower Sensor Value'].strip('%'))
                upper_sensor_value = float(row['Upper % value'].strip('%'))

                avg_brack_point = (lower_percent_value + upper_percent_value) / 2
                avg_value = (lower_sensor_value + upper_sensor_value) / 2

                data.append({
                    "name": f"{name} ({level})",
                    "avg_brack_point": avg_brack_point,
                    "avg_value": avg_value
                })
        return data
    
    def get(self, request):
        data = cache.get('crop_data')
        if not data:
            data = self.load_crop_data()
            cache.set('crop_data', data, 60*60)
        serialized_data = self.get_serializer(data, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)

class CropTypeChangeView(generics.UpdateAPIView):
    serializer_class = DeviceBasedFieldsCropTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Field.objects.none()
        return Field.objects.filter(user=self.request.user)

    def update(self, request, device_id, *args, **kwargs):
        crop_type = request.data.get('crop_type')
        try:
            device = Device.objects.get(id=device_id, user=request.user)
        except Device.DoesNotExist:
            return Response({"errors": "Device not found"}, status=status.HTTP_404_NOT_FOUND)
        fields = Field.objects.filter(
            user=request.user,
            devices=device_id
        )
        for field in fields:
            field.crop_type = crop_type
            field.save()
        return Response({"message": "Crop type updated successfully"}, status=status.HTTP_200_OK)