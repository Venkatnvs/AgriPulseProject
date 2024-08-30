from rest_framework import generics, permissions, filters, serializers, status
from .models import Field
from .serializers import FieldSerializer, WeatherAndForecastSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import FieldFilter
from rest_framework.response import Response
import requests
from django.conf import settings

class FieldListCreate(generics.ListCreateAPIView):
    serializer_class = FieldSerializer
    permission_classes = [ permissions.IsAuthenticated ]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FieldFilter
    search_fields = ['name', 'crop_type']

    def get_queryset(self):
        return Field.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        fields = Field.objects.filter(user = self.request.user, name = serializer.validated_data['name'])
        if fields.exists():
            raise serializers.ValidationError("Field with this name already exists")
        serializer.save(user=self.request.user)
    
class FieldRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FieldSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        return Field.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
