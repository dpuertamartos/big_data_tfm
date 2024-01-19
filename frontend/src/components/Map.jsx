import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const SpainMap = () => {
  // Spain's geographical center coordinates
  const position = [40.416775, -3.703790];

  // Custom icon (optional)
  const icon = new L.Icon({
    iconUrl: 'path_to_marker_icon',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ height: '500px', width: '500px', margin: '20px auto' }}>
        <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>
            {/* Using CartoDB's Positron (light) tiles for a minimalistic look */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://carto.com/attribution">CARTO</a>'
            />
        </MapContainer>
    </div>
  );
};

export default SpainMap;
