from rest_framework import generics, permissions, filters
from .models import SoilSensor, Device
from .serializers import SoilSensorSerializer,DeviceSerializer

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
        return SoilSensor.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SoilSensorRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SoilSensorSerializer
    permission_classes = [ permissions.IsAuthenticated ]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return SoilSensor.objects.none()
        return SoilSensor.objects.filter(user=self.request.user)