from rest_framework import generics, permissions
from .models import SoilSensor
from .serializers import SoilSensorSerializer

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
        return SoilSensor.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)