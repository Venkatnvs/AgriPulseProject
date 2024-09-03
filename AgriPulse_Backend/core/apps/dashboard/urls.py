from django.urls import path
from .views import (
    DashboardView,
    GetAllMainDashBoardGraphData
)

urlpatterns = [
    path('card-counts/', DashboardView.as_view(), name='dashboard'),
    path('main-charts/', GetAllMainDashBoardGraphData.as_view(), name='dashboard'),
]