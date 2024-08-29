from django.db import models
from django.contrib.auth import get_user_model
import math

User = get_user_model()

class Field(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='land_fields')
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True, null=True)
    crop_type = models.CharField(max_length=100)
    geometry = models.JSONField() # GeoJSON
    size = models.FloatField(help_text="Size of the field in acres")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.name} - {self.user.email}"
    
    def get_representative_coordinate(self):
        if not self.geometry:
            return None
        try:
            if isinstance(self.geometry, dict):
                lat, lng = self.geometry['coordinates'][0][0]
            else:
                lat, lng = self.geometry[0][0]
        except (KeyError, IndexError):
            return None
        return lat, lng
    
    def getXY(self, lat, lon, zoom):
        numTiles = 1 << zoom
        lat = max(-85.05112878, min(85.05112878, lat))
        lon = (lon + 180) % 360 - 180
        x = round((lon + 180) / 360 * numTiles)
        y = round((1 - math.log(math.tan(lat * math.pi / 180) + 1 / math.cos(lat * math.pi / 180)) / math.pi) / 2 * numTiles)
        return [x, y]

    def getGoogleMapsTileUrl(self, longitude, latitude, zoom):
        xTile, yTile = self.getXY(latitude, longitude, zoom)

        url = f'https://mt1.google.com/vt/lyrs=y&x={xTile}&y={yTile}&z={zoom}'
        return url
    
    @property
    def main_coordinate(self):
        return self.get_representative_coordinate()
    
    @property
    def google_maps_url(self):
        if not self.main_coordinate:
            return None
        return self.getGoogleMapsTileUrl(self.main_coordinate[0], self.main_coordinate[1], 17)