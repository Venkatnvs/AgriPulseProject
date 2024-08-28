from django.urls import path
from .views import (
    FieldListCreate,
    FieldRetrieveUpdateDestroy,
)

urlpatterns = [
    path('', FieldListCreate.as_view(), name='field-list-create'),
    path('<int:pk>/', FieldRetrieveUpdateDestroy.as_view(), name='field-retrieve-update-destroy'),
]