from django.urls import path
from .views import (
    FieldListCreate,
    FieldRetrieveUpdateDestroy,
    WeatherAndForecast,
    FieldListSelect,
    FieldDeviceLinkView,
    CropsDataView,
    CropTypeChangeView
)

urlpatterns = [
    path('', FieldListCreate.as_view(), name='field-list-create'),
    path('<int:pk>/', FieldRetrieveUpdateDestroy.as_view(), name='field-retrieve-update-destroy'),

    path('<int:device_id>/select-list/', FieldListSelect.as_view(), name='field-list-select'),
    path('<int:pk>/link-device/', FieldDeviceLinkView.as_view(), name='field-link-device'),

    path('weather-and-forecast/', WeatherAndForecast.as_view(), name='weather-and-forecast'),

    path('crops-data/', CropsDataView.as_view(), name='crops-data'),
    path('<int:device_id>/crop-type-change/', CropTypeChangeView.as_view(), name='crop-type-change')
]