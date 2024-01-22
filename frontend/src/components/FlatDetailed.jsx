import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import flatService from '../services/flats';

const Flat = () => {
  const { id } = useParams();
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const data = await flatService.get(id);
        // Check if photos is a string and try to parse it
        if (data && typeof data.photos === 'string') {
          try {
            data.photos = JSON.parse(data.photos);
          } catch (e) {
            console.error("Error parsing photos:", e);
            data.photos = [];
          }
        }
        setFlat(data);
      } catch (error) {
        console.error("Error fetching flat:", error);
      }
    };
    fetchFlat();
  }, [id]);

  if (!flat) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography>Loading...</Typography></Box>;

  const renderField = (label, value) => {
    return value ? (
      <Typography variant="body1"><strong>{label}:</strong> {value}</Typography>
    ) : null;
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {flat.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {flat.location}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            {renderField('Price', flat.price_euro)}
            {renderField('Rating', Math.floor(flat.rating * 100) / 100)}
            {renderField('Bedrooms', flat.habitaciones)}
            {renderField('Bathrooms', flat.banos)}
            {renderField('Floor', flat.planta)}
            {renderField('Built Surface', `${flat.superficie_construida_m2} m²`)}
            {renderField('Useful Surface', `${flat.superficie_util_m2} m²`)}
            {renderField('Heating', flat.calefaccion)}
            {renderField('Reference', flat.referencia)}
            {/* Add more fields as necessary */}
          </Grid>
          <Grid item xs={6}>
            <Box>
              {flat.photos && flat.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Flat view ${index}`} style={{ width: '100%', marginBottom: 10 }} />
              ))}
            </Box>
          </Grid>
        </Grid>

        {flat.description && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {flat.description}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          {flat.amueblado && <Chip label="Furnished" color="primary" variant="outlined" />}
          {flat.armarios_empotrados && <Chip label="Fitted Wardrobes" color="primary" variant="outlined" />}
          {flat.ascensor && <Chip label="Elevator" color="primary" variant="outlined" />}
          {/* Add more chips for other boolean fields */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Flat;

