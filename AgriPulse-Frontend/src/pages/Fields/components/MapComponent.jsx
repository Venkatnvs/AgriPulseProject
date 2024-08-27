import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMap } from 'react-leaflet/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { polygon, area } from '@turf/turf';

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider()

    const searchControl = new GeoSearchControl({
      provider,
      style: '',
      showMarker: true,
      showPopup: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address',
      keepResult: true,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

const MapComponent = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    notes: '',
  });
  const navigate = useNavigate();

  const handleDrawCreated = e => {
    const layer = e.layer;
    const latLngs = layer.getLatLngs()[0];
    console.log(latLngs);
    const area = calculateArea(latLngs);

    console.log(area);
    setSelectedArea({
      coordinates: latLngs,
      size: area,
    });
  };
  const calculateArea = (latLngs) => {
    // Ensure the polygon is closed
    const coordinates = latLngs.map(latLng => [latLng.lng, latLng.lat]);
  
    // Check if the first and last coordinates are the same
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
      coordinates.push(coordinates[0]); // Close the polygon
    }

    // Create a Turf.js polygon
    const turfPolygon = polygon([coordinates]);

    // Calculate area in square meters
    const turfArea = area(turfPolygon);

    return turfArea.toFixed(2); // Return area rounded to 2 decimal places
}

  const handleSubmit = () => {
    if (selectedArea) {
      const newField = {
        ...formData,
        coordinates: selectedArea.coordinates,
        size: selectedArea.size, // Size in square meters
      };
      navigate('/');
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '10px', background: '#f4f4f4' }}>
        <h2>Add New Field</h2>
        <input
          type='text'
          name='name'
          placeholder='Field Name'
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type='text'
          name='cropType'
          placeholder='Type of Crop'
          value={formData.cropType}
          onChange={handleChange}
        />
        <textarea
          name='notes'
          placeholder='Notes'
          value={formData.notes}
          onChange={handleChange}
        />
        {selectedArea && (
          <div>
            <p>Area: {selectedArea.size} square meters</p>
          </div>
        )}
        <button onClick={handleSubmit} disabled={!selectedArea}>
          Save Field
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[15.667104, 76.701766]}
          zoom={13}
          style={{ height: '100%' }}
        >
          <TileLayer
            url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
          />
          <SearchField />
          <FeatureGroup>
            <EditControl
              position='topright'
              onCreated={handleDrawCreated}
              draw={{
                rectangle: true,
                polygon: true,
                circle: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
