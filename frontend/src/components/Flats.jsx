import { useState, useEffect, useRef } from 'react'
import Notification from './Notification'
import Listing from './Listing'
import Filter from './Filter'
import { Grid, Container, Box, useTheme, useMediaQuery, Drawer, CircularProgress } from '@mui/material'
import flatService from '../services/flats'
import debounce from 'lodash/debounce' // You might need to install lodash for this

const Flats = ({ errorMessage, drawerOpen, handleDrawerToggle }) => {
    const [allFlats, setAllFlats] = useState([])
    const [filters, setFilters] = useState({
        provincia: '',
        isCapital: '',
        tipo: '',
        precio: [0, 2000000],
        habitaciones: [0, 10],
        m2Utiles: [0, 500],
        rating: [-1, 0.7],
        orderBy: undefined
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [observerActive, setObserverActive] = useState(false) // State to control observer activation
    const theme = useTheme()
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))
    const initialLoad = useRef(true) // To track the first load

    const fetchFilteredFlats = async (type = 'updatedFilters') => {
        setIsLoading(true)
        try {
            const params = {
                province: filters.provincia,
                isCapital: filters.isCapital,
                type: filters.tipo,
                orderBy: filters.orderBy,
                limitNumber: 15,
                page: currentPage,
            }

            
          if (filters.precio[0] > 0 || filters.precio[1] < 2000000) {
              params.price_euro = filters.precio
          }

          if (filters.habitaciones[0] > 0 || filters.habitaciones[1] < 10) {
              params.habitaciones = filters.habitaciones
          }

          if (filters.m2Utiles[0] > 0 || filters.m2Utiles[1] < 500) {
              params.m2 = filters.m2Utiles
          }

          if (filters.rating[0] > -0.75 || filters.rating[1] < 0.7) {
              params.rating = filters.rating
          }
            const filteredFlats = await flatService.getFiltered(params)
            if (type === 'updatedFilters') {
                setAllFlats(filteredFlats)
            } else {
                setAllFlats(prevFlats => [...prevFlats, ...filteredFlats])
            }

            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching filtered flats:", error)
            setIsLoading(false)
        } finally {
            if (initialLoad.current) {
                initialLoad.current = false // Mark initial load as complete
                setObserverActive(true) // Activate observer after initial load
            }
        }
    }

    useEffect(() => { window.scrollTo(0, 0)}, [filters])

    useEffect(() => {
        fetchFilteredFlats()
    }, []) // Fetch data on initial mount only

  // Debounced fetch for filter changes
    const debouncedFetch = debounce(() => {
        if (!initialLoad.current) { // Only debounce fetch if initial load is complete
            fetchFilteredFlats('updatedFilters')
        }
    }, 500)

    useEffect(() => {
        if (!initialLoad.current) { // If not the first load
            debouncedFetch()
            return () => debouncedFetch.cancel()
        }
    }, [filters]) // Execute when filters change

    useEffect(() => {
        if (observerActive) { // Only setup observer if active
            const observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    setCurrentPage(prevPage => prevPage + 1)
                }
            }, {
                rootMargin: '100px',
            })

            const sentinel = document.getElementById('scroll-sentinel')
            if (sentinel) observer.observe(sentinel)

            return () => observer.disconnect()
        }
    }, [observerActive])

    useEffect(() => {
        if (currentPage > 1 && !initialLoad.current) {
            fetchFilteredFlats('nextPage')
        }
    }, [currentPage])



    const handleSliderChange = (event, newValue) => {
        const name = event.target.name || event.target.getAttribute('name')
        const value = newValue !== undefined ? newValue : event.target.value
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }))
        setCurrentPage(1)
    }

    const handleprovinceChange = (event, newValue) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            provincia: newValue
        }))
        setCurrentPage(1)
    }

    const handleSelectorChange = (event) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [event.target.name]: event.target.value
        }))
        setCurrentPage(1)
    }


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
                width: '90%', // Ajusta el ancho del Drawer
                maxHeight: '85vh', // Restringe la altura máxima
                overflowY: 'auto', // Permite desplazamiento si el contenido excede el maxHeight
                display: 'flex', 
                flexDirection: 'column', // Alinea el contenido verticalmente
                justifyContent: 'flex-start', // Alinea el contenido desde la parte superior
                alignItems: 'center', // Centra el contenido horizontalmente
                margin: 'auto',
                paddingTop: theme.spacing(2), // Usa theme.spacing para un relleno superior consistente
              }
            }}
          >
            <Box sx={{ width: '70%' }}> {/* Ajusta el ancho del Box para llenar el Drawer */}
              <Filter
                filters={filters}
                onFilterChange={handleSliderChange}
                onprovinceChange={handleprovinceChange}
                onSelectorChange={handleSelectorChange}
              />
            </Box>
          </Drawer>
          {isLargeScreen && (
            <Box sx={{
              position: 'fixed',
              width: '100%',
              maxWidth: 400,
              overflowY: 'auto',
              height: '100%',
              pb: '5%',
              px: '2%'
            }}>
              <Filter
                filters={filters}
                onFilterChange={handleSliderChange}
                onprovinceChange={handleprovinceChange}
                onSelectorChange={handleSelectorChange}
              />
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={8} 
        
        sx={{
          backgroundImage: 'url("3_small.jpg")',
          backgroundSize: 'contain', // Keeps the image covering the entire section
          backgroundPosition: 'center', // Adjust this value to focus on a specific part of the image (e.g., 'top', 'center', 'bottom')
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: "5%",
          ml: isLargeScreen ? '450px' : 0,
          mb: "15%"
          }}
        >
          <Listing data={{ [filters.provincia || 'all']: allFlats }} />
          {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
        </Box>}
          <div id="scroll-sentinel" />
        </Grid>
        
      </Grid>
    </Container>
  )

}

export default Flats
