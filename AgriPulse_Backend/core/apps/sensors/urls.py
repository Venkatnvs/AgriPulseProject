from django.urls import path
from .views import SoilSensorListCreate, SoilSensorRetrieveUpdateDestroy

urlpatterns = [
    path('', SoilSensorListCreate.as_view(), name='soil-sensor-list-create'),
    path('<int:pk>/', SoilSensorRetrieveUpdateDestroy.as_view(), name='soil-sensor-retrieve-update-destroy'),
]