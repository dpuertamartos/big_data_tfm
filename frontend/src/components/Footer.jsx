import { Box, Typography } from '@mui/material';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            color: 'text.secondary',
            p: 3,
            textAlign: 'center',
            fontStyle: 'italic',
            m: 8
        }}>
            <Typography variant="body2">
                Flujo de datos para análisis de oportunidades inmobiliarias, David Puerta - Universidad de Burgos, {currentYear}
            </Typography>
        </Box>
    );
}

export default Footer;