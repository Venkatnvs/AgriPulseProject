from rest_framework import generics, status, permissions
from rest_framework.response import Response
from core.apps.fields.models import Field
from core.apps.sensors.models import Device, SoilSensor
from .serializers import DashboardDataSerializer
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DashboardView(generics.GenericAPIView):
    permissions = [permissions.IsAuthenticated,]
    serializer_class = DashboardDataSerializer

    def get_dashboard_data(self, user, start_date, end_date):
        fields = Field.objects.filter(user=user, created_at__range=[start_date, end_date]).only('id')
        devices = Device.objects.filter(user=user, created_at__range=[start_date, end_date]).only('id', 'configurations')
        sensors = sum([device.get_sensor_count_from_configurations for device in devices ])
        sensors_readings = SoilSensor.objects.filter(device__user=user, timestamp__range=[start_date, end_date]).only('id')

        return {
            'fields': fields.count(),
            'devices': devices.count(),
            'sensors_readings': sensors_readings.count(),
            'sensors': sensors
        }

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'start_date', 
                openapi.IN_QUERY, 
                description="Start date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=(datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            ),
            openapi.Parameter(
                'end_date', 
                openapi.IN_QUERY, 
                description="End date for filtering (YYYY-MM-DD)", 
                type=openapi.TYPE_STRING, 
                format='date', 
                default=datetime.now().strftime('%Y-%m-%d')
            ),
        ]
    )
    def get(self, request):
        user = request.user
        end_date = request.query_params.get('end_date', datetime.now().date())
        start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).date())
        if isinstance(end_date, str):
            end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        if isinstance(start_date, str):
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        try:
            dashboard_data = self.get_dashboard_data(user, start_date, end_date)
            serialized_data = self.serializer_class(data=dashboard_data)
            if serialized_data.is_valid():
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            else:
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)