import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapComponent = ({ onShapeCreated }) => {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={onShapeCreated}
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
    );
};

export default MapComponent;
