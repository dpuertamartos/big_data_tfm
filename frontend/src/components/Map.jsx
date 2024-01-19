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
    <div style={{ height: '500px', width: '800px', margin: '20px auto' }}>
        <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>

        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        </MapContainer>
    </div>
  );
};

export default SpainMap;
