// Flats.jsx
import React, { useState, useEffect } from 'react'
import Notification from './Notification'
import Listing from './Listing'
import Filter from './Filter' // Import the Filter component
import { Container, Grid } from '@mui/material'
import flatService from '../services/flats'

const Flats = ({ errorMessage }) => {
    const [flats, setFlats] = useState([])
    const [filters, setFilters] = useState({
        ciudad: '',
        tipo: '',
        precio: [0, 1000000],
        habitaciones: [0, 10],
        m2Utiles: [0, 500],
        rating: [0, 5]
    })

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                const initialFlats = await flatService.getAll()
                setFlats(initialFlats)
            } catch (error) {
                console.error("Error fetching initial flats:", error)
            }
        }
        fetchFlats()
    }, [])

    const handleFilterChange = (event, newValue) => {
        const name = event.target.name || event.target.getAttribute('name')
        const value = newValue !== undefined ? newValue : event.target.value
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }))
    }

    const applyFilters = () => {
        return flats.filter(flat => {
            return (
                (filters.ciudad ? flat.ciudad === filters.ciudad : true) &&
                (filters.tipo ? flat.tipo === filters.tipo : true) &&
                (flat.precio >= filters.precio[0] && flat.precio <= filters.precio[1]) &&
                (flat.habitaciones >= filters.habitaciones[0] && flat.habitaciones <= filters.habitaciones[1]) &&
                (flat.m2Utiles >= filters.m2Utiles[0] && flat.m2Utiles <= filters.m2Utiles[1]) &&
                (flat.rating >= filters.rating[0] && flat.rating <= filters.rating[1])
            )
        })
    }

    const filteredFlats = applyFilters()

    return (
        <Container>
            <Notification message={errorMessage} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Filter filters={filters} onFilterChange={handleFilterChange} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Listing data={filteredFlats} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Flats;
