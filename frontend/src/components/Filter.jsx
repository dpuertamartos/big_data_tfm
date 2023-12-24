// Filter.js
import { TextField, Slider, Box, Typography, FormControl, Autocomplete, InputLabel, Select, MenuItem } from '@mui/material';
import cities from '../../../cities.json'; // Ensure this path is correct

const formatSliderLabel = (value, max) => {
    return value === max ? `${max}+` : value
}

const Filter = ({ filters, onFilterChange, onCityChange, onTipoChange, onSortChange }) => {
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
            <FormControl fullWidth margin="normal">
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                    labelId="tipo-label"
                    name="tipo"
                    value={filters.tipo || ''} // Ensure the value is not undefined
                    label="Tipo"
                    onChange={onTipoChange}
                >
                    <MenuItem value="piso">Piso</MenuItem>
                    <MenuItem value="casa">Casa</MenuItem>
                    <MenuItem value="chalet">Chalet</MenuItem>
                    <MenuItem value="apartamento">Apartamento</MenuItem>
                    <MenuItem value="atico">Ático</MenuItem>
                    <MenuItem value="duplex">Dúplex</MenuItem>
                    <MenuItem value="estudio">Estudio</MenuItem>
                    <MenuItem value="loft">Loft</MenuItem>
                </Select>
            </FormControl>
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
                    valueLabelFormat={(value) => formatSliderLabel(value, 1000000)}
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
                    valueLabelFormat={(value) => formatSliderLabel(value, 10)}
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
                    valueLabelFormat={(value) => formatSliderLabel(value, 500)}
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
            <FormControl fullWidth margin="normal">
                        <InputLabel id="sort-order-label">Ordenar por</InputLabel>
                        <Select
                            labelId="sort-order-label"
                            value={filters.orderBy || '' }
                            label="Ordenar por"
                            onChange={onSortChange}
                        >
                            <MenuItem value="rating ASC">Rating (High to Low)</MenuItem>
                            <MenuItem value="rating DESC">Rating (Low to High)</MenuItem>
                            <MenuItem value="price_euro ASC">Precio (Low to High)</MenuItem>
                            <MenuItem value="price_euro DESC">Precio (High to Low)</MenuItem>
                            <MenuItem value="superficie_util_m2 ASC">Superficie (Low to High)</MenuItem>
                            <MenuItem value="superficie_util_m2 DESC">Superficie (High to Low)</MenuItem>
                        </Select>
            </FormControl>
        </Box>
    )
}

export default Filter

