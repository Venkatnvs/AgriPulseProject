from django.urls import path
from .views import (
    SoilSensorListCreate, 
    SoilSensorRetrieveUpdateDestroy,
    DeviceListCreate,
    DeviceRetrieveUpdateDestroy,
    DeviceSelectList,
    SoilSensorListByDevice,
    SoilSensorLatestData,
    DeviceConfigure
)

urlpatterns = [
    path('', SoilSensorListCreate.as_view(), name='soil-sensor-list-create'),
    path('<int:pk>/', SoilSensorRetrieveUpdateDestroy.as_view(), name='soil-sensor-retrieve-update-destroy'),

    path('devices/<int:device_id>/sensors/', SoilSensorListByDevice.as_view(), name='soil-sensor-list-create'),
    path('devices/<int:device_id>/sensors/latest/', SoilSensorLatestData.as_view(), name='soil-sensor-latest-data'),

    path('devices/<int:pk>/configure/', DeviceConfigure.as_view(), name='device-configure'),

    path('devices/select-list/', DeviceSelectList.as_view(), name='device-select-list'),

    path('devices/', DeviceListCreate.as_view(), name='device-list-create'),
    path('devices/<int:pk>/', DeviceRetrieveUpdateDestroy.as_view(), name='device-retrieve-update-destroy'),
]