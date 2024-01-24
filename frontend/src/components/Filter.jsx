// Filter.js
import { TextField, Slider, Box, Typography, FormControl, Autocomplete, InputLabel, Select, MenuItem } from '@mui/material';
import { provincesOptions } from '../utils/selectors_options.js'

const formatSliderLabel = (value, max) => {
    return value === max ? `${max}+` : value
}

const Filter = ({ filters, onFilterChange, onprovinceChange, onIsCapitalChange, onTipoChange, onSortChange }) => {

    return (
        <Box>
            <Autocomplete
                value={filters.ciudad}
                onChange={onprovinceChange}
                options={Object.keys(provincesOptions)}
                getOptionLabel={(option) => option ? provincesOptions[option] : ''}
                renderInput={(params) => (
                    <TextField {...params} label="Provincia" margin="normal" />
                )}
                fullWidth
                freeSolo
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="capital-label">Capital</InputLabel>
                <Select
                    labelId="capital-label"
                    name="capital"
                    value={filters.isCapital || ''} // Ensure the value is not undefined
                    label="Capital"
                    onChange={onIsCapitalChange}
                >
                    <MenuItem value="">Indiferente</MenuItem>
                    <MenuItem value="1">En la capital</MenuItem>
                    <MenuItem value="0">Fuera de la capital</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                    labelId="tipo-label"
                    name="tipo"
                    value={filters.tipo || ''} // Ensure the value is not undefined
                    label="Tipo"
                    onChange={onTipoChange}
                >
                    <MenuItem value="">Todos</MenuItem>
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
                    Puntuación
                </Typography>
                <Slider
                    name="rating"
                    value={filters.rating}
                    onChange={onFilterChange}
                    valueLabelDisplay="auto"
                    min={-1}
                    max={2}
                    step={0.1}
                    valueLabelFormat={(value) => formatSliderLabel(value, 2)}
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
                            <MenuItem value="rating DESC">Puntuación (Primero Altos)</MenuItem>
                            <MenuItem value="rating ASC">Puntuación (Primero Bajos)</MenuItem>
                            <MenuItem value="price_euro DESC">Precio (Primero Altos)</MenuItem>
                            <MenuItem value="price_euro ASC">Precio (Primero Bajos)</MenuItem>
                            <MenuItem value="superficie_util_m2 DESC">Superficie (Primero Altos)</MenuItem>
                            <MenuItem value="superficie_util_m2 ASC">Superficie (Primero Bajos)</MenuItem>
                        </Select>
            </FormControl>
        </Box>
    )
}

export default Filter

