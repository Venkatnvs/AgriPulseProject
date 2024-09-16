from django.contrib import admin
from .models import UserFCMToken

class UserFCMTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'fcm_token', 'last_updated', 'last_notified')
    search_fields = ['user',]

admin.site.register(UserFCMToken, UserFCMTokenAdmin)