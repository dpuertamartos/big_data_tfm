import { Box, Typography, useTheme } from '@mui/material'

const Footer = () => {
    const theme = useTheme()
    const currentYear = new Date().getFullYear()

    return (
        <Box sx={{
            bgcolor: 'background.default',  // You can use a shade of your theme's background color
            color: 'text.secondary',
            px: 2,  // Horizontal padding
            py: 3,  // Vertical padding
            textAlign: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,  // A top border for a subtle separation from the content
            mt: 'auto',  // Push footer to the bottom of the layout
            fontStyle: 'italic',
        }}>
            <Typography variant="body2">
                Flujo de Datos para Descubrimiento de Oportunidades Inmobiliarias © {currentYear}
            </Typography>
        </Box>
    )
}

export default Footer
