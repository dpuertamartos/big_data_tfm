import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import provinceData from '../../provinces.json';

const SpainMap = ({ filteredData, selectedCategories, categoryColorMapping }) => {
    const position = [40.416775, -3.703790]; // Centro de España
    const [markers, setMarkers] = useState([]);


    useEffect(() => {
        const calculateMarkerData = () => {
            let newMarkers = [];
            const offsetAmount = 0.25; // Separation amount

            // Calculate offsets for each category
            const categoryOffsets = selectedCategories.reduce((acc, category, index) => {
                const angle = (index / selectedCategories.length) * Math.PI * 2;
                acc[category] = { x: Math.cos(angle) * offsetAmount, y: Math.sin(angle) * offsetAmount };
                return acc;
            }, {});

            // Generate markers
            filteredData.forEach(item => {
                const provinceInfo = provinceData.locations_coordinates_capitals.find(p => p.name === item.province_group);
                if (provinceInfo) {
                    selectedCategories.forEach(category => {
                        if (item.hasOwnProperty(category)) {
                            const offset = categoryOffsets[category];
                            newMarkers.push({
                                coordinates: [provinceInfo.coordinates[1] + offset.y, provinceInfo.coordinates[0] + offset.x],
                                radius: Math.max(item[category] * 30, 1),
                                category,
                                value: item[category],
                                province: item.province_group,
                                color: categoryColorMapping[category],
                            });
                        }
                    });
                }
            });

            return newMarkers;
        };
        const markers = calculateMarkerData()
        setMarkers(markers);
    }, [filteredData, selectedCategories, categoryColorMapping]);

    return (
        <Box sx={{
            height: 250, // Altura fija
            width: '100%', // Ancho responsivo
            maxWidth: 300, // Ancho máximo
            margin: 'auto', // Centrar horizontalmente
        }}>
            <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://carto.com/attribution">CARTO</a>'
                />
                
                {markers.map((marker) => (
                    <CircleMarker
                        key={`${marker.province}-${marker.category}-${marker.color}`} // Unique key for each marker
                        center={marker.coordinates}
                        radius={marker.radius}
                        fillColor={marker.color}
                        color={marker.color}
                        weight={1}
                        opacity={1}
                        fillOpacity={0.7}
                    >
                        <Popup>{marker.province}: ({(marker.value * 100).toFixed(2)}%), {marker.category} </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </Box>
    );
};

export default SpainMap;
