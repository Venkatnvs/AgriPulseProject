from django.urls import path
from .views import (
    FieldListCreate,
    FieldRetrieveUpdateDestroy,
    WeatherAndForecast,
)

urlpatterns = [
    path('', FieldListCreate.as_view(), name='field-list-create'),
    path('<int:pk>/', FieldRetrieveUpdateDestroy.as_view(), name='field-retrieve-update-destroy'),

    path('weather-and-forecast/', WeatherAndForecast.as_view(), name='weather-and-forecast'),
]