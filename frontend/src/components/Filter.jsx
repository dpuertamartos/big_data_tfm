import { useState, useEffect } from 'react';
import { TextField, Slider, Box, Typography, FormControl, Autocomplete, InputLabel, Select, MenuItem } from '@mui/material';
import { provincesOptions } from '../utils/selectors_options.js';

const formatSliderLabel = (value, max) => {
    return value === max ? `${max}+` : value;
};

const calculatePriceFromSlider = (sliderValue) => {
    if (sliderValue <= 20) {
        return sliderValue * 10000;
    } else if (sliderValue <= 35) {
        // Adjusted for 200,000 to 500,000 range with 20,000 steps
        return 200000 + (sliderValue - 20) * 20000;
    } else {
        // Adjusted for 500,000 to 2M range with 250,000 steps
        return 500000 + (sliderValue - 35) * 250000;
    }
};

const calculateSliderFromPrice = (price) => {
    if (price <= 200000) {
        return price / 10000;
    } else if (price <= 500000) {
        // Adjusted for 200,000 to 500,000 range with 20,000 steps
        return 20 + (price - 200000) / 20000;
    } else {
        // Adjusted for 500,000 to 2M range with 250,000 steps
        return 35 + (price - 500000) / 250000;
    }
};

const Filter = ({ filters, onFilterChange, onprovinceChange, onIsCapitalChange, onTipoChange, onSortChange }) => {
    // Local states for sliders
    const [localPrice, setLocalPrice] = useState(filters.precio.map(calculateSliderFromPrice));
    const [localHabitaciones, setLocalHabitaciones] = useState(filters.habitaciones);
    const [localM2Utiles, setLocalM2Utiles] = useState(filters.m2Utiles);
    const [localRating, setLocalRating] = useState(filters.rating);

    const marks = [
        {
            value: calculateSliderFromPrice(0),
            label: '0€',
        },
        {
            value: calculateSliderFromPrice(100000),
            label: '100k€',
        },
        {
            value: calculateSliderFromPrice(200000),
            label: '200k€',
        },
        {
            value: calculateSliderFromPrice(500000),
            label: '500k€',
        },
        {
            value: calculateSliderFromPrice(2000000),
            label: '2M€+',
        },
    ];
    // Sync local state with global state
    useEffect(() => {
        setLocalPrice(filters.precio.map(calculateSliderFromPrice));
        setLocalHabitaciones(filters.habitaciones);
        setLocalM2Utiles(filters.m2Utiles);
        setLocalRating(filters.rating);
    }, [filters]);

    const handleSliderChange = (name, newValue) => {
        switch (name) {
            case 'precio':
                setLocalPrice(newValue);
                break;
            case 'habitaciones':
                setLocalHabitaciones(newValue);
                break;
            case 'm2Utiles':
                setLocalM2Utiles(newValue);
                break;
            case 'rating':
                setLocalRating(newValue);
                break;
            default:
                break;
        }
    };

    const handleSliderChangeCommitted = (name, newValue) => {
        if (name === 'precio') {
            const priceValue = newValue.map(calculatePriceFromSlider);
            onFilterChange({ target: { name } }, priceValue);
        }
        else {
            onFilterChange({ target: { name } }, newValue);
        }
    };

    return (
        <Box>
            <Autocomplete
                value={filters.provincia}
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
                <Typography gutterBottom>Precio</Typography>
                <Slider
                    name="precio"
                    value={localPrice}
                    min={0}
                    max={calculateSliderFromPrice(2000000)}
                    onChange={(event, newValue) => handleSliderChange('precio', newValue)}
                    onChangeCommitted={(event, newValue) => handleSliderChangeCommitted('precio', newValue)}
                    valueLabelDisplay="auto"
                    marks={marks}
                    valueLabelFormat={(value) => `${calculatePriceFromSlider(value)}€`}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>Habitaciones</Typography>
                <Slider
                    name="habitaciones"
                    value={localHabitaciones}
                    onChange={(event, newValue) => handleSliderChange('habitaciones', newValue)}
                    onChangeCommitted={(event, newValue) => handleSliderChangeCommitted('habitaciones', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    marks={[{value:0,label:'0'},{value:1},{value:2},{value:3},{value:4},{value:5},
                    {value:6},{value:7},{value:8},{value:9},{value:10,label: '10+'}]}
                    valueLabelFormat={(value) => formatSliderLabel(value, 10)}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>M2 Útiles</Typography>
                <Slider
                    name="m2Utiles"
                    value={localM2Utiles}
                    onChange={(event, newValue) => handleSliderChange('m2Utiles', newValue)}
                    onChangeCommitted={(event, newValue) => handleSliderChangeCommitted('m2Utiles', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500}
                    step={10}
                    marks={[{value:0,label:'0'},{value:50,label:'50'},{value:100,label:'100'},{value:200,label:'200'},{value:300},
                    {value:400},{value:500,label: '500+ m2'}]}
                    valueLabelFormat={(value) => formatSliderLabel(value, 500)}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <Typography gutterBottom>Puntuación</Typography>
                <Slider
                    name="rating"
                    value={localRating}
                    onChange={(event, newValue) => handleSliderChange('rating', newValue)}
                    onChangeCommitted={(event, newValue) => handleSliderChangeCommitted('rating', newValue)}
                    valueLabelDisplay="auto"
                    min={-1}
                    max={0.7}
                    step={0.1}
                    marks={[{value:-1, label:'-1'},{value:-0.4, label:'-0.4'},{value:0,label:"0"},{value:0.4,label:"0.4"},{value:0.7,label:"0.7+"}]}
                    valueLabelFormat={(value) => formatSliderLabel(value, 0.7)}
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

