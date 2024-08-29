from rest_framework import serializers
from .models import Field

class FieldSerializer(serializers.ModelSerializer):
    main_coordinate = serializers.SerializerMethodField()
    map_tile_url = serializers.SerializerMethodField()

    class Meta:
        model = Field
        fields = ['id', 'user', 'name', 'description', 'crop_type', 'geometry', 'size', 'created_at', 'updated_at', 'main_coordinate', 'map_tile_url']
        read_only_fields = ['id' ,'user', 'created_at', 'updated_at', 'main_coordinate']

    def get_main_coordinate(self, obj):
        return obj.main_coordinate
    
    def get_map_tile_url(self, obj):
        return obj.google_maps_url

    def validate_user(self, value):
        if value != self.context['request'].user:
            raise serializers.ValidationError("You can't create fields for other users")
        return value

    def validate(self, data):
        if self.instance:
            for field in self.Meta.read_only_fields:
                data[field] = getattr(self.instance, field)
        return data