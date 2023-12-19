import { TextField, Slider, Box, Typography, FormControl } from '@mui/material'

const Filter = ({ filters, onFilterChange }) => {
    return (
        <Box>
            <TextField
                label="Ciudad"
                name="ciudad"
                value={filters.ciudad}
                onChange={onFilterChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Tipo"
                name="tipo"
                value={filters.tipo}
                onChange={onFilterChange}
                fullWidth
                margin="normal"
            />

            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>
                    Precio
                </Typography>
                <Slider
                    name="precio"
                    value={filters.precio}
                    onChange={onFilterChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000000}
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>
                    Habitaciones
                </Typography>
                <Slider
                    name="habitaciones"
                    value={filters.habitaciones}
                    onChange={onFilterChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>
                    M2 Útiles
                </Typography>
                <Slider
                    name="m2Utiles"
                    value={filters.m2Utiles}
                    onChange={onFilterChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500}
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>
                    Rating
                </Typography>
                <Slider
                    name="rating"
                    value={filters.rating}
                    onChange={onFilterChange}
                    valueLabelDisplay="auto"
                    min={-0.75}
                    max={0.75}
                    step={0.05}
                />
            </FormControl>
        </Box>
    )
}

export default Filter;

