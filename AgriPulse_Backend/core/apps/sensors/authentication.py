from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Device

class DeviceTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        if not request.path.startswith('/api/core/sensors/'):
            return None

        try:
            token_type, token = auth_header.split()
            if token_type != 'DeviceToken':
                return None
            device = Device.objects.get(access_token=token.strip())
            print(device)
            if not device.is_active:
                raise AuthenticationFailed('Device is Deactivated or Suspended')
            if not device.is_configured:
                device.is_configured = True
                device.save()
            request.current_device = device
            return (device.user, None)
        except (Device.DoesNotExist, ValueError, IndexError) as e:
            print(e)
            raise AuthenticationFailed('Invalid device token')