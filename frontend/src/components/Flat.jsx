import { Card, CardContent, Typography, Grid, Box, Chip, Button, Collapse } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Importing icon for location



const spanishLabels = {
  exterior_summary: 'Exterior',
  vidrios_dobles_summary: 'Vidrios Dobles',
  adaptado_a_personas_con_movilidad_reducida_summary: 'Accesible',
  puerta_blindada_summary: 'Puerta Blindada',
  ascensor_summary: 'Ascensor',
  balcon_summary: 'Balcón',
  portero_automatico_summary: 'Portero Automático',
  garaje_summary: 'Garaje',
  comedor_summary: 'Comedor',
  terraza_summary: 'Terraza',
  jardin_summary: 'Jardín',
  armarios_empotrados_summary: 'Armarios Empotrados',
  aire_acondicionado_summary: 'Aire Acondicionado',
  trastero_summary: 'Trastero',
  piscina_summary: 'Piscina',
  chimenea_summary: 'Chimenea',
  lavadero_summary: 'Lavadero',
  soleado_summary: 'Soleado',
  gas_summary: 'Gas',
  amueblado_summary: 'Amueblado',
  cocina_equipada_summary: 'Cocina Equipada',
  calefaccion_summary: 'Calefacción',
};

const spanishFields = {
  heating: 'Calefacción',
  conservacion: 'Conservación',
  antiguedad: 'Antigüedad',
  urbanizado_summary: 'Urbanizado',
  calle_alumbrada_summary: 'Calle Alumbrada',
  calle_asfaltada_summary: 'Calle Asfaltada',
  interior_summary: 'Interior',
  mascotas_summary: 'Mascotas',
  carpinteria_exterior_cleaned: 'Carpintería Exterior',
  tipo_suelo_summary: 'Tipo de Suelo',
  cocina_summary: 'Cocina',
  orientacion_summary: 'Orientación',
  type: 'Tipo',
  reference: 'Referencia'
}

const Flat = ({flat}) => {
  const [openDescription, setOpenDescription] = useState(false);
  const handleToggleDescription = () => {
    setOpenDescription(!openDescription);
  };

  if (!flat) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography>Loading...</Typography></Box>;

  if (flat && typeof flat.photos === 'string') {
    try {
      flat.photos = JSON.parse(flat.photos);
    } catch (e) {
      console.error("Error parsing photos:", e);
      flat.photos = [];
    }
  }

  const renderField = (label, value) => {
    return value ? (
      <Typography key={label} variant="body1"><strong>{label}:</strong> {value}</Typography>
    ) : null;
  };
  
  const renderFields = () => {
    return Object.entries(spanishFields).map(([key, label]) => {
      
      return flat[key] ? renderField(label, flat[key]) : null
    });
  }

  const renderChips = () => {
    return Object.entries(spanishLabels).map(([key, label]) => {
      if (flat[key] === 'YES') {
        return <Chip key={key} label={label} color="primary" variant="outlined" sx={{ mr: 1, mb: 1 }} />;
      }
      return null;
    });
  };

  const formatProvince = (province) => {
    return province
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // Capitalize first letter of each word
  };

  console.log(flat)
  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: 'primary.main', // Assuming primary is a shade of blue
            fontWeight: 'bold'
          }}
        >
          {flat.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ color: 'primary.light', mr: 1 }} /> {/* Icon with color */}
          <Typography color="text.secondary">
            {flat.location}
          </Typography>
        </Box>

        <Typography 
          sx={{ 
            color: 'primary.main', // Use secondary color or any other color that fits your theme
            fontWeight: 'medium',
            mb: 2 // Margin bottom for spacing
          }}
        >
          {formatProvince(flat.province)}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            {renderField('Precio', flat.price_euro ? `${flat.price_euro} €`: undefined)}
            {renderField('Puntuación asignada', Math.floor(flat.rating * 100) / 100)}
            {renderField('Habitaciones', flat.habitaciones)}
            {renderField('Baños', flat.banos)}
            {renderField('Planta', flat.planta)}
            {renderField('Superficie construida', flat.superficie_construida_m2 ? `${flat.superficie_construida_m2} m²`: undefined)}
            {renderField('Superficie útil', flat.superficie_util_m2 ? `${flat.superficie_util_m2} m²`: undefined)}
            {renderFields()}
            </Grid>
          <Grid item xs={6}>
            {flat.photos && flat.photos.length > 0 && (
              <Carousel>
                {flat.photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={photo}
                      alt={`Flat view ${index}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Grid>
        </Grid>
        
        {flat.link && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LinkIcon />}
              href={flat.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 2, mr: 2 }}
            >
              Ver en pisos.com
            </Button>
          )}

        {flat.description && (
          <>
            <Button
              onClick={handleToggleDescription}
              sx={{ mt: 2 }}
              variant="contained"
              size="small"
              endIcon={openDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Descripción
            </Button>
            <Collapse in={openDescription}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {flat.description}
              </Typography>
            </Collapse>
          </>
        )}



        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
          {renderChips()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Flat;
