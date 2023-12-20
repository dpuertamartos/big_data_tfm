// Filter.js
import { TextField, Slider, Box, Typography, FormControl, Autocomplete } from '@mui/material'
import cities from '../../../cities.json' // Ensure this path is correct

const Filter = ({ filters, onFilterChange, onCityChange }) => {
    const cityOptions = cities.locations

    return (
        <Box>
            <Autocomplete
                value={filters.ciudad}
                onChange={onCityChange}
                options={cityOptions}
                getOptionLabel={(option) => option ? option : ''}
                renderInput={(params) => (
                    <TextField {...params} label="Ciudad" margin="normal" />
                )}
                fullWidth
                freeSolo
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

export default Filter

