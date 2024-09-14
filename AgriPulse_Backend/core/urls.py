from django.urls import path, include
from .views import ContactUsListCreate, ContactUsRetrieveUpdateDestroy

urlpatterns = [
    path('fields/', include('core.apps.fields.urls')),
    path('sensors/', include('core.apps.sensors.urls')),
    path('dashboard/', include('core.apps.dashboard.urls')),

    # Contact Us
    path('contact-us/', ContactUsListCreate.as_view(), name='contact-us-list-create'),
    path('contact-us/<int:pk>/', ContactUsRetrieveUpdateDestroy.as_view(), name='contact-us-retrieve-update-destroy'),
]