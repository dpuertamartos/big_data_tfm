import { useState, useEffect } from 'react'
import Notification from './Notification'
import Listing from './Listing'
import Filter from './Filter'
import { Grid, Container, Box, useTheme, useMediaQuery, Drawer } from '@mui/material'
import flatService from '../services/flats'
import debounce from 'lodash/debounce' // You might need to install lodash for this

const Flats = ({ errorMessage, drawerOpen, handleDrawerToggle }) => {
    const [allFlats, setAllFlats] = useState([]) // To store all flats fetched from backend
    const [filters, setFilters] = useState({
        provincia: '',
        isCapital: '',
        tipo: '',
        precio: [0, 1000000],
        habitaciones: [0, 10],
        m2Utiles: [0, 500],
        rating: [-1, 2],
        orderBy: undefined
    })

    const fetchFilteredFlats = async () => {
      try {
          const params = { 
              province: filters.provincia, 
              isCapital: filters.isCapital,
              type: filters.tipo,
              orderBy: filters.orderBy,
              limitNumber: 15
          }
  
          // Only include price filter if not at default min or max
          if (filters.precio[0] > 0 || filters.precio[1] < 1000000) {
              params.price_euro = filters.precio
          }
  
          // Similar logic for other filters
          if (filters.habitaciones[0] > 0 || filters.habitaciones[1] < 10) {
              params.habitaciones = filters.habitaciones
          }
  
          if (filters.m2Utiles[0] > 0 || filters.m2Utiles[1] < 500) {
              params.m2 = filters.m2Utiles
          }
  
          if (filters.rating[0] > -0.75 || filters.rating[1] < 0.75) {
              params.rating = filters.rating
          }
  
          const filteredFlats = await flatService.getFiltered(params)
          setAllFlats(filteredFlats)
      } catch (error) {
          console.error("Error fetching filtered flats:", error)
      }
  }

    const debouncedFetch = debounce(fetchFilteredFlats, 500)

    useEffect(() => {
        debouncedFetch()
        // Cancel the debounce on useEffect cleanup.
        return debouncedFetch.cancel
    }, [filters]) // Add other major filters if needed

    // Apply minor filters on the frontend
    const applyFilters = () => {
        return allFlats.filter(flat => {
            return (
              flat.price_euro >= filters.precio[0] &&
              (filters.precio[1] < 1000000 ? flat.price_euro <= filters.precio[1] : true) &&
              flat.habitaciones >= filters.habitaciones[0] &&
              (filters.habitaciones[1] < 10 ? flat.habitaciones <= filters.habitaciones[1] : true) &&
              flat.superficie_util_m2 >= filters.m2Utiles[0] &&
              (filters.m2Utiles[1] < 500 ? flat.superficie_util_m2 <= filters.m2Utiles[1] : true) &&
              flat.rating >= filters.rating[0] &&
              (filters.rating[1] < 0.75 ? flat.rating <= filters.rating[1] : true)
          )
        })
    }

    const filteredFlats = applyFilters()

    const handleFilterChange = (event, newValue) => {
        const name = event.target.name || event.target.getAttribute('name')
        const value = newValue !== undefined ? newValue : event.target.value
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }))
    }

    const handleprovinceChange = (event, newValue) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            provincia: newValue
        }))
    }

    const handleIsCapitalChange = (event) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            isCapital: event.target.value
        }))
    }

    const handleTipoChange = (event) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            tipo: event.target.value
        }))
    }

    const handleSortChange = (event) => {
        setFilters(prevFilters => ({
          ...prevFilters,
          orderBy: event.target.value
      }))
  }


  
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));


  return (
    <Container fixed>
      <Notification message={errorMessage} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <Drawer
            variant="temporary"
            anchor="top"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                width: '100%', // Sets the drawer's width to 100%
                maxHeight: '100vh', // Optional: Restricts the maximum height
                display: 'flex', // Use flex container
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                }
            }}
            >
            <Box sx={{ width: '70%' }}>
                <Filter
                filters={filters}
                onFilterChange={handleFilterChange}
                // ... other props
                />
            </Box>
            </Drawer>
          {isLargeScreen && (
            <Box sx={{
              position: 'fixed',
              width: '100%',
              maxWidth: 360
            }}>
              <Filter
                filters={filters}
                onFilterChange={handleFilterChange}
                onprovinceChange={handleprovinceChange}
                onIsCapitalChange={handleIsCapitalChange}
                onTipoChange={handleTipoChange}
                onSortChange={handleSortChange}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={8} sx={{ ml: isLargeScreen ? '400px' : 0 }}>
          <Listing data={{ [filters.provincia || 'all']: filteredFlats }} />
        </Grid>
      </Grid>
    </Container>
  );

}

export default Flats
