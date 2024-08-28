from django.urls import path, include

urlpatterns = [
    path('fields/', include('core.apps.fields.urls')),
]