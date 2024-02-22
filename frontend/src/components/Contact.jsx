// Contact.jsx
import React from 'react'
import { Button, Box, Typography, Grid, Paper, List, ListItem, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

const Contact = () => {
    const faqs = [
        { question: "¿Cómo interpreto la puntuación positiva asignada por el algoritmo de Machine Learning?", answer: "Si tiene una puntuación superior a 0, indica que el precio que el algoritmo le asigna es superior al precio de venta. \
        Un rating de 0.25, indica que el algoritmo le asigna un precio un 25% superior al precio de venta, consinderándolo una interesante oportunidad." },
        { question: "¿Cómo interpreto la puntuación negativa asignada por el algoritmo de Machine Learning?", answer: "Si tiene una puntuación negativa o inferior a 0, indica que el precio que el algoritmo le asigna es inferior al precio de venta. \
        Un rating de -0.4, indica que el algoritmo le asigna un precio un 40% inferior al precio de venta, considerándolo una no tan interesante oportunidad." },
        { question: "¿Me puedo fiar del algoritmo y la puntuación asignada?", answer: "La puntuación asignada es solamente orientativa y se debe comparar con las características y fotos del inmueble. Hay muchos factores adicionales que el algoritmo no tiene en cuenta, ya que el algoritmo solo predice utilizando datos prefijados que ha podido obtener del anuncio" },
        { question: "Un piso tiene una puntuación muy alta!! Seguro que es un chollazo", answer: "Puntuaciones por encima de 0.33 suelen ser o bien errores, o bien anuncios de inmuebles en los que se han omitido muchos datos, o tienen alguna característica muy indeseable que el algoritmo no ha contemplado. Por ejemplo un piso con rating 3, podría parecer una muy buena oportunidad, ya que el algortimo ha determinado que vale 300% más que su precio de venta, sin embargo, nadie vendería un inmueble a 3 veces menos que su valor" },
        { question: "¿Esta web tiene afiliación con alguna empresa?", answer: "Esta web no tiene ningún tipo de afiliación, ni ánimo de lucro actualmente, se ha desarrollado en el marco de un Trabajo de Fin de Máster" },
        { question: "¿Cada cuanto se actualizan los datos?", answer: "Actualmente dos veces al día. Aproximadamente al mediodía y a la medianoche, hora española." },

    ]

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box sx={{
            flexGrow: 1, 
            backgroundImage: 'url("4_medium.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', // use minHeight instead of height
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            p: isSmallScreen ? 2 : 4, // responsive padding
        }}>
            <Grid container spacing={isSmallScreen ? 2 : 3} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{
                        p: isSmallScreen ? 2 : 4, // responsive padding
                        bgcolor: 'background.paper',
                        opacity: 0.95,
                        overflow: 'auto', // allow scrolling within Paper if content overflows
                        mb: isSmallScreen ? 2 : 0, // add bottom margin on small screens
                    }}>
                        <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>Información de contacto</Typography>
                        <Button 
                        variant="outlined" 
                        startIcon={<MailOutlineIcon />} 
                        href="mailto:dpuerta@usal.es" 
                        sx={{ my: 2, textTransform: 'none' }}
                        >
                        dpuerta@usal.es
                        </Button>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>Sobre la página web</Typography>
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify' }}>
                        Esta web está desarrollada como vía de interacción y visualización con el flujo de datos creado desde el portal inmobiliario pisos.com. 
                        <br />
                        <br />
                        Los datos de inmuebles se han enriquecido mediante Machine Learning para asignarles una puntuación.  
                        <br />
                        <br />
                        También se han transformado y agregado para su análisis a través de visualizaciones y un cuadro de mandos completo, disponible en la pestaña "VISUALIZA".
                        <br />
                        <br />
                        Los datos son reales y actualizados diariamente.
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 'bold' }}>Sobre mí</Typography>
                        <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                        Mi nombre es David Puerta Martos.
                        <br />
                        <br />
                        Tras un período trabajando en investigación (CSIC), comencé a trabajar como Ingeniero de Datos.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{
                                p: isSmallScreen ? 2 : 4, // responsive padding
                                bgcolor: 'background.paper',
                                opacity: 0.95,
                                overflow: 'auto', // allow scrolling within Paper if content overflows
                            }}>
                        <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>Preguntas Frecuentes</Typography>
                        <List>
                            {faqs.map((faq, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={<Typography color="text.primary" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>}
                                            secondary={faq.answer}
                                        />
                                    </ListItem>
                                    {index !== faqs.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Contact




