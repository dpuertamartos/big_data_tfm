import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import flatService from '../services/flats';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

const Flat = () => {
  const { id } = useParams();
  const [flat, setFlat] = useState(null);
  const [openRatingHelpDialog, setOpenRatingHelpDialog] = useState(false);


  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const data = await flatService.get(id);
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

  const infobutton = () => {
    return(
      <Tooltip title="Más información sobre puntuación">
            <IconButton onClick={handleOpenRatingHelpDialog} size="small" color="" sx={{pb:1 }}>
              <HelpOutlineIcon />
            </IconButton>
      </Tooltip>
    )
  }

  const renderField = (label, value) => {
    return value ? (
      <Typography key={label} variant="body1"><strong>{label}{label==='Puntuación asignada'?infobutton():''}:</strong> {value} </Typography>
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

  // Funciones para manejar la apertura y cierre del diálogo de ayuda
  const handleOpenRatingHelpDialog = () => setOpenRatingHelpDialog(true);
  const handleCloseRatingHelpDialog = () => setOpenRatingHelpDialog(false);

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {flat.title}. {flat.province}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {flat.location}
        </Typography>

        <Grid container spacing={2}>
        <Grid item xs={6}>
            {renderField('Precio de Venta', flat.price_euro ? `${flat.price_euro} €`: undefined)}
            {renderField('Valor Estimado', flat.prediction ?`${Math.floor(flat.prediction)} €`:undefined )}
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

        {flat.description && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {flat.description}
          </Typography>
        )}

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
          {renderChips()}
        </Box>
      </CardContent>
      <Dialog open={openRatingHelpDialog} onClose={handleCloseRatingHelpDialog}>
        <DialogTitle>{"Puntuación Asignada"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" gutterBottom> En este caso, una puntuación de {Math.floor(flat.rating*1000)/1000} significa que el algoritmo le asigna un valor ({Math.floor(flat.prediction)}€)
            un {Math.floor(flat.rating*1000)/10}% {flat.rating >= 0 ? 'superior' : 'inferior'} al precio de venta ({flat.price_euro}€)
            </Typography>
            <Typography variant="body1" gutterBottom> La puntuación se calcula de la siguiente forma: </Typography>
            <Typography variant="body1" gutterBottom>( Precio Asignado por el Algoritmo - Precio ) / Precio.</Typography>

            <Typography variant="body1" gutterBottom>Puntuaciones por encima de 0.33 suelen tratarse de falsos positivos. Esto se puede deber a que sean ejemplos extremos que el modelo tenga dificultad para clasificar. También es posible que falten detalles listados, o que su estado sea muy malo y de ahí su bajo precio.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingHelpDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Flat;

