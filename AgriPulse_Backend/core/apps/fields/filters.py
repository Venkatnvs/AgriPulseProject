import django_filters
from .models import Field

class FieldFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains', field_name='name')
    crop_type = django_filters.CharFilter(lookup_expr='icontains', field_name='crop_type')
    date_range = django_filters.DateFromToRangeFilter(field_name='created_at')
    class Meta:
        model = Field
        fields = ['name', 'size', 'crop_type', 'date_range']