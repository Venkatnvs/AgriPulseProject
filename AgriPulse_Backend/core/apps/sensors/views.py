from rest_framework import generics, permissions, filters
from .models import SoilSensor, Device
from .serializers import SoilSensorSerializer,DeviceSerializer, DeviceListSerializer

class DeviceListCreate(generics.ListCreateAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [ permissions.IsAuthenticated ]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DeviceRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Device.objects.none()
        return Device.objects.filter(user=self.request.user)

class SoilSensorListCreate(generics.ListCreateAPIView):
    serializer_class = SoilSensorSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        return SoilSensor.objects.filter(device__user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SoilSensorRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SoilSensorSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return SoilSensor.objects.none()
        return SoilSensor.objects.filter(device__user=self.request.user)
    
class DeviceSelectList(generics.ListAPIView):
    serializer_class = DeviceListSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

class SoilSensorListByDevice(generics.ListAPIView):
    serializer_class = SoilSensorSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        device_id = self.kwargs['device_id']
        return SoilSensor.objects.filter(device=device_id, device__user=self.request.user)

class SoilSensorLatestData(generics.ListAPIView):
    serializer_class = SoilSensorSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        device_id = self.kwargs['device_id']
        return SoilSensor.objects.filter(device=device_id, device__user=self.request.user).order_by('-timestamp')[:1]
    
class DeviceConfigure(generics.UpdateAPIView):
    serializer_class = DeviceSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Device.objects.none()
        return Device.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(is_configured=True)