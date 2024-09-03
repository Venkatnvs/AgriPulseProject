from rest_framework import generics, status, permissions
from rest_framework.response import Response
from core.apps.fields.models import Field
from core.apps.sensors.models import Device, SoilSensor
from .serializers import DashboardDataSerializer,SoilSensorChartSerializer,AggregatedMainGraphsSerializer
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from functools import reduce
from django.db.models import Avg,Count
from django.db.models.functions import TruncDate,TruncMonth
from collections import defaultdict

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
        

class GetAllMainDashBoardGraphData(generics.GenericAPIView):
    permissions = [permissions.IsAuthenticated,]
    serializer_class = AggregatedMainGraphsSerializer

    def get_dashboard_data3(self, user, start_date, end_date):
        data = Field.objects.filter(
            user=user,
            created_at__range=[start_date, end_date]
        ).values('crop_type').annotate(count=Count('id')).order_by('crop_type')
        response_data = [
            {'crop_type': item['crop_type'], 'count': item['count']} for item in data
        ]
        return response_data

    def get_dashboard_data2(self, user, start_date, end_date):
        fields_by_month = Field.objects.filter(
            user=user,
            created_at__range=[start_date, end_date]
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(fields=Count('id')).order_by('month')
        devices_by_month = Device.objects.filter(
            user=user,
            created_at__range=[start_date, end_date]
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(devices=Count('id')).order_by('month')
        monthly_data = defaultdict(lambda: {'fields': 0, 'devices': 0})
        for entry in fields_by_month:
            monthly_data[entry['month']]['fields'] = entry['fields']
        for entry in devices_by_month:
            monthly_data[entry['month']]['devices'] = entry['devices']
        final_data = [
            {'month': month.strftime('%B'), 'devices': data['devices'], 'fields': data['fields']}
            for month, data in sorted(monthly_data.items())
        ]
        if final_data:
            for i in range(0, datetime.now().month):
                if not any(x['month'] == datetime.strptime(str(i+1), "%m").strftime('%B') for x in final_data):
                    final_data.append({'month': datetime.strptime(str(i+1), "%m").strftime('%B'), 'devices': 0, 'fields': 0})
        final_data = sorted(final_data, key=lambda x: datetime.strptime(x['month'], '%B'))

        if len(final_data) > 1:
            last_month_data = final_data[-1]
            previous_month_data = final_data[-2]
            def calculate_percentage_increase(current, previous):
                if previous == 0:
                    return 0  # Avoid division by zero
                return ((current - previous) / previous) * 100
            devices_increase = calculate_percentage_increase(
                last_month_data['devices'],
                previous_month_data['devices']
            )
            fields_increase = calculate_percentage_increase(
                last_month_data['fields'],
                previous_month_data['fields']
            )
            final_data[-1]['devices_increase_percentage'] = int(devices_increase)
            final_data[-1]['fields_increase_percentage'] = int(fields_increase)
        else:
            final_data[-1]['devices_increase_percentage'] = None
            final_data[-1]['fields_increase_percentage'] = None
        return final_data

    def get_dashboard_data1(self, user, start_date, end_date):
        sensors = SoilSensor.objects.filter(
            device__user=user,
            timestamp__range=[start_date, end_date]
        )
        daily_data = defaultdict(lambda: {
            'temperature': [],
            'humidity': [],
            'soil_moisture': []
        })
        for sensor in sensors:
            date = sensor.timestamp.date()
            daily_data[date]['temperature'].append(sensor.temperature if sensor.temperature else 0)
            daily_data[date]['humidity'].append(sensor.humidity if sensor.humidity else 0)
            daily_data[date]['soil_moisture'].append(sensor.get_average_soil_moisture())

        def calculate_average(values):
            # Filter out zero values
            filtered_values = [x for x in values if x != 0 ]
            return reduce(lambda acc, x: acc + x, filtered_values, 0) / len(filtered_values) if filtered_values else 0

        data = []
        for date, values in sorted(daily_data.items()):
            avg_temperature = calculate_average(values['temperature'])
            avg_humidity = calculate_average(values['humidity'])
            avg_soil_moisture = calculate_average(values['soil_moisture'])
            
            data.append({
                'date': date,
                'temperature': avg_temperature,
                'humidity': avg_humidity,
                'avg_soil_moisture': avg_soil_moisture
            })

        return data

    def get(self, request):
        user = request.user
        end_date = request.query_params.get('end_date', datetime.now().date())
        start_date = request.query_params.get('start_date', (datetime.now() - timedelta(days=30)).date())
        if isinstance(end_date, str):
            end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
        if isinstance(start_date, str):
            start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        try:
            dashboard_data1 = self.get_dashboard_data1(user, start_date, end_date)
            dashboard_data2 = self.get_dashboard_data2(user, start_date, end_date)
            dashboard_data3 = self.get_dashboard_data3(user, start_date, end_date)
            new_data = {
                'chart1':dashboard_data1,
                'chart2':dashboard_data2,
                'chart3':dashboard_data3
            }
            serialized_data = self.serializer_class(data=new_data)
            if serialized_data.is_valid():
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            else:
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)