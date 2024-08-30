import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

const MapWithFields = ({ fieldDetails }) => {
  const map = useMap();

  useEffect(() => {
    const latlngs = fieldDetails?.geometry?.coordinates[0].map(coord => [
      coord[1],
      coord[0],
    ]);

    const polygon = L.polygon(latlngs, { color: '#E6E804', fillColor: '#db4f32' }).addTo(map);

    polygon.bindPopup(`<p>Area: ${fieldDetails?.size} acres</p>`).openPopup();

    const bounds = polygon.getBounds();
    map.fitBounds(bounds);
  }, [map, fieldDetails]);

  return null;
};

const DisplayMapView = ({ fieldDetails }) => {
  if (!fieldDetails) return null;
  if (!fieldDetails.geometry) return null;

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
  );
};

export default DisplayMapView;
