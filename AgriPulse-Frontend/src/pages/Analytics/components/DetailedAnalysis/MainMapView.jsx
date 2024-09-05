import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const MapWithFields = ({ fieldDetails }) => {
  const map = useMap();

  useEffect(() => {
    let bounds = L.latLngBounds(); 
    for(let i = 0; i < fieldDetails.length; i++) {
      const latlngs = fieldDetails[i]?.geometry?.coordinates[0].map(coord => [
        coord[1],
        coord[0],
      ]);
      console.log(latlngs);

      const polygon = L.polygon(latlngs, { color: '#E6E804', fillColor: '#db4f32' }).addTo(map);

      polygon.bindPopup(`<p>Area: ${fieldDetails[i]?.size} acres</p>`).openPopup();

      bounds.extend(polygon.getBounds());
    }
    map.fitBounds(bounds);
  }, [map, fieldDetails]);

  return null;
};

const MainMapView = ({
  fieldDetails
}) => {
  return (
    <div className='flex-col z-0 w-full h-full'>
      <MapContainer zoom={13} className='h-full'>
        <TileLayer
          url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
        />
        <MapWithFields fieldDetails={fieldDetails} />
      </MapContainer>
    </div>
  )
}

export default MainMapView