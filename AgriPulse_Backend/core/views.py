from django.shortcuts import render
from rest_framework import generics, permissions
from .models import ContactUs
from .serializers import ContactUsSerializer

class ContactUsListCreate(generics.ListCreateAPIView):
    serializer_class = ContactUsSerializer
    permission_classes = [ permissions.AllowAny ]
    
    def get_queryset(self):
        return ContactUs.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()

class ContactUsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactUsSerializer
    permission_classes = [ permissions.AllowAny ]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ContactUs.objects.none()
        return ContactUs.objects.all()