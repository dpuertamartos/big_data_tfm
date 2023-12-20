import { useState, useEffect } from 'react';
import Notification from './Notification';
import Listing from './Listing';
import Filter from './Filter';
import { Container, Grid } from '@mui/material';
import flatService from '../services/flats';
import debounce from 'lodash/debounce'; // You might need to install lodash for this

const Flats = ({ errorMessage }) => {
    const [allFlats, setAllFlats] = useState([]); // To store all flats fetched from backend
    const [filters, setFilters] = useState({
        ciudad: '',
        tipo: '',
        precio: [0, 1000000],
        habitaciones: [0, 10],
        m2Utiles: [0, 500],
        rating: [-0.75, 0.75]
    });

    // Fetch flats based on major filters like city or type
    const fetchFilteredFlats = async () => {
        try {
            const params = { 
              city: filters.ciudad, 
              type: filters.tipo,
              price_euro: filters.precio,
              habitaciones: filters.habitaciones,
              m2: filters.m2,
              rating: filters.rating   
            };

            const filteredFlats = await flatService.getFiltered(params); // Update the service to handle this method
            setAllFlats(filteredFlats);
        } catch (error) {
            console.error("Error fetching filtered flats:", error);
        }
    };

    const debouncedFetch = debounce(fetchFilteredFlats, 500);

    useEffect(() => {
        debouncedFetch();
        // Cancel the debounce on useEffect cleanup.
        return debouncedFetch.cancel;
    }, [filters]); // Add other major filters if needed

    // Apply minor filters on the frontend
    const applyFilters = () => {
        return allFlats.filter(flat => {
            return (
                (flat.price_euro >= filters.precio[0] && flat.price_euro <= filters.precio[1]) &&
                (flat.habitaciones >= filters.habitaciones[0] && flat.habitaciones <= filters.habitaciones[1]) &&
                (flat.superficie_util_m2 >= filters.m2Utiles[0] && flat.superficie_util_m2 <= filters.m2Utiles[1]) &&
                (flat.rating >= filters.rating[0] && flat.rating <= filters.rating[1])
            );
        });
    };

    const filteredFlats = applyFilters();

    const handleFilterChange = (event, newValue) => {
        const name = event.target.name || event.target.getAttribute('name');
        const value = newValue !== undefined ? newValue : event.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleCityChange = (event, newValue) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ciudad: newValue
        }));
    };

    const handleTipoChange = (event) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            tipo: event.target.value
        }));
    };

    return (
        <Container>
            <Notification message={errorMessage} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Filter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onCityChange={handleCityChange}
                        onTipoChange={handleTipoChange}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Listing data={{ 'all': filteredFlats }} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Flats;
