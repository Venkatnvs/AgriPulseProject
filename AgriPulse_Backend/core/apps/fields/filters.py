import django_filters
from .models import Field

class FieldFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    area = django_filters.NumberFilter()
    crop_type = django_filters.CharFilter(lookup_expr='icontains')
    date_range = django_filters.DateFromToRangeFilter(field_name='created_at')

    class Meta:
        model = Field
        fields = ['name', 'area', 'crop_type', 'date_range']