from rest_framework import serializers
from .models import ContactUs
from django.core.validators import validate_email

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        email = attrs.get('email', None)
        if email:
            try:
                validate_email(email)
            except:
                raise serializers.ValidationError('Invalid email address')
        else :
            raise serializers.ValidationError('Email address is required')
        name = attrs.get('name', None)
        if name:
            if len(name) < 3:
                raise serializers.ValidationError('Name must be at least 3 characters long')
        else:
            raise serializers.ValidationError('Name is required')
        message = attrs.get('message', None)
        if message:
            if len(message) < 3:
                raise serializers.ValidationError('Message must be at least 3 characters long')
        else:
            raise serializers.ValidationError('Message is required')
        return attrs