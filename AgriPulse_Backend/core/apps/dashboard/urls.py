from django.urls import path
from .views import (
    DashboardView,
)

urlpatterns = [
    path('card-counts/', DashboardView.as_view(), name='dashboard'),
]