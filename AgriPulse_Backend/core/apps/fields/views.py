from rest_framework import generics, permissions, filters, serializers
from .models import Field
from .serializers import FieldSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import FieldFilter

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