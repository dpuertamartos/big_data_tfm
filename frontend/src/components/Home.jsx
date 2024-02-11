import { useState, useEffect } from 'react'
import flatService from '../services/flats'
import HomeFilters from './HomeFilters'
import Listing from './Listing'
import { Box, Button, useTheme, useMediaQuery, Drawer, Typography, Grid, Container } from '@mui/material'
import { Link } from "react-router-dom"
import { styled } from '@mui/system'


const SectionDivider = styled(Box)(({ theme }) => ({
  height: '2px',
  width: '100%',
  background: theme.palette.divider,
  margin: theme.spacing(4, 0),
}))

const Home = ({ drawerOpen, handleDrawerToggle }) => {
  const [bestFlats, setBestFlats] = useState({})
  const [selectedprovinces, setSelectedprovinces] = useState(["all"])
  const [selectedIsCapital, setSelectedIsCapital] = useState("all")
  const [smartMode, setSmartMode] = useState("Si")
  const [isLoading, setIsLoading] = useState(false)
  const [openHelpDialog, setOpenHelpDialog] = useState(false)
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))
  
  useEffect(() => {
    setIsLoading(true)
    const fetchBestFlats = async () => {
      try {
        let updatedFlats = {}
        for (const province of selectedprovinces) {
          try {
            const params = {
                isCapital: selectedIsCapital !== 'all' ? selectedIsCapital: undefined,
                orderBy: 'rating DESC',
                limitNumber: 5,
                rating: smartMode === 'Si' ? [-1, 0.33] : undefined
            }
    
            if (province !== 'all') {
              params.province = province
            }
            const flats = await flatService.getFiltered(params)
            updatedFlats[province] = flats
          } catch (error) {
            console.error(`Error fetching flats for ${province}:`, error)
        }
        await setBestFlats({...updatedFlats})
      }} catch (error) {
        console.error("Error fetching initial flats:", error)
      } 
    }

    fetchBestFlats()
    setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Set loading to false
  }, [selectedIsCapital, smartMode])


  const handleChange = async (event, isCapitalChange = false) => {
    setIsLoading(true) // Set loading to true immediately
  
    if (isCapitalChange) {
      setSelectedIsCapital(event.target.value)
    } else {
      const newSelectedprovinces = event.target.value
      setSelectedprovinces(newSelectedprovinces)
  
      let updatedFlats = { ...bestFlats }
  
      // Fetch new flats for newly selected provinces
      for (const province of newSelectedprovinces) {
        if (!bestFlats[province]) {
          try {
            const params = {
              province: province !== 'all' ? province : undefined,
              orderBy: 'rating DESC', 
              limitNumber: 5,
              isCapital: selectedIsCapital !== 'all' ? selectedIsCapital : undefined,
              rating: smartMode === 'Si' ? [-1, 0.33] : undefined
            }
            const flats = await flatService.getFiltered(params)
            updatedFlats[province] = flats
          } catch (error) {
            console.error(`Error fetching flats for ${province}:`, error)
          }
        }
      }
  
      // Remove flats for unselected provinces
      for (const province in bestFlats) {
        if (!newSelectedprovinces.includes(province)) {
          delete updatedFlats[province]
        }
      }

      setBestFlats(updatedFlats)
    }
  
    // Delay setting isLoading to false
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }  

  const handleOpenHelpDialog = () => {
    setOpenHelpDialog(true)
  }

  const handleCloseHelpDialog = () => {
    setOpenHelpDialog(false)
  }

  const Filters = () => <HomeFilters 
    isLargeScreen={isLargeScreen} isLoading={isLoading}
    selectedprovinces={selectedprovinces} selectedIsCapital={selectedIsCapital} smartMode={smartMode} 
    setSmartMode={setSmartMode} handleChange={handleChange}
    openHelpDialog={openHelpDialog} handleOpenHelpDialog={handleOpenHelpDialog} handleCloseHelpDialog={handleCloseHelpDialog}/>
  
  return (
    <Box>
        <Box sx={{
        backgroundImage: 'url("/1_big.jpg")',
        backgroundSize: 'cover', // Keeps the image covering the entire section
        backgroundPosition: 'center', // Adjust this value to focus on a specific part of the image (e.g., 'top', 'center', 'bottom')
        height: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        mb: "10%",
        pl: "4%",
        pr: "4%"
      }}>
        <Typography variant="h2" sx={{ mb: 4 }} gutterBottom>Encuentra tu hogar soñado</Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>Descubre inmuebles interesantes gracias a nuestro algoritmo de aprendizaje automático</Typography>
        <Button size="large" variant="contained" color="primary" sx={{ m: 1 }} component={Link} to="/flats">Empieza tu búsqueda</Button>
        <Button size="large" variant="outlined"  sx={{ m: 2, borderColor: '#fff', color: '#fff' }} component={Link} to="/trends">Visualiza</Button>
      </Box>
      <Container>
      <Box sx={{ flexGrow: 1, py: isLargeScreen?0:"4%", px: isLargeScreen ? 8 : 4, mb:"10%", backgroundColor: 'background.default' }}>
        <Grid container spacing={isLargeScreen ? 10 : 2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="div" color="primary.main" gutterBottom>
              Flujo de datos actualizado
            </Typography>
            <Typography variant="h6" color="text.primary" textAlign="justify">
              Hemos desarrollado un flujo de datos desde uno de los mayores portales inmobiliarios de España, lo que permite ofrecer una perspectiva innovadora en tendencias de inmuebles, precios y oportunidades de compra.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="div" color="primary.main" gutterBottom>
              Aprendizaje Automático
            </Typography>
            <Typography variant="h6" color="text.primary" textAlign="justify">
              Los datos permiten el entrenamiento de nuestros modelos de aprendizaje automático, que enriquecen el descubrimiento de tu próximo hogar mediante la asignación de un valor y puntuación a cada inmueble.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      </Container>

      <SectionDivider />
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
              {Filters()}
      </Drawer>
      
      <Box sx={{
        backgroundImage: 'url("3_small.jpg")',
        backgroundSize: 'contain', // Keeps the image covering the entire section
        backgroundPosition: 'center', // Adjust this value to focus on a specific part of the image (e.g., 'top', 'center', 'bottom')
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: "3%",
        padding: "5%",
        maxWidth: "90%",
        ml: "5%"
      }}> 
        {isLargeScreen && Filters()}
        <Listing data={bestFlats} isCapital={selectedIsCapital} singleColumn={false}/>
      </Box>
    </Box>
  )
}

export default Home






