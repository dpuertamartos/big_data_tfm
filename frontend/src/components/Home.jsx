import { useState, useEffect } from 'react'
import flatService from '../services/flats'
import trendService from '../services/trends'
import SelectFilter from './SelectFilter'
import LineGraph from './LineGraph'
import Listing from './Listing'
import { Box, useTheme, useMediaQuery, Drawer } from '@mui/material'
import { capitalOptions, provincesOptions } from '../utils/selectors_options.js'


const Home = ({ drawerOpen, handleDrawerToggle }) => {
  const [bestFlats, setBestFlats] = useState({})
  const [selectedprovinces, setSelectedprovinces] = useState(["all"])
  const [trendData, setTrendData] = useState([])
  const [selectedIsCapital, setSelectedIsCapital] = useState("all");
  const [smartMode, setSmartMode] = useState("No")
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchInitialTrends = async () => {
      try {
        const initialTrends = await trendService.get({
          active: 'all',
          type: 'all',
          isCapital: selectedIsCapital
        });
        setTrendData(initialTrends);
      } catch (error) {
        console.error("Error fetching initial trends:", error);
      }
    };

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

    fetchInitialTrends()
    fetchBestFlats()
    setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Set loading to false
  }, [selectedIsCapital, smartMode]);


  const handleChange = async (event, isCapitalChange = false) => {
    setIsLoading(true); // Set loading to true immediately
  
    if (isCapitalChange) {
      setSelectedIsCapital(event.target.value);
    } else {
      const newSelectedprovinces = event.target.value;
      setSelectedprovinces(newSelectedprovinces);
  
      let updatedFlats = { ...bestFlats };
  
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
            };
            const flats = await flatService.getFiltered(params);
            updatedFlats[province] = flats;
          } catch (error) {
            console.error(`Error fetching flats for ${province}:`, error);
          }
        }
      }
  
      // Remove flats for unselected provinces
      for (const province in bestFlats) {
        if (!newSelectedprovinces.includes(province)) {
          delete updatedFlats[province];
        }
      }
  
      setBestFlats(updatedFlats);
    }
  
    // Delay setting isLoading to false
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };  

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const Filters = () => {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column', gap: isLargeScreen ? 6 : 0}}>
          <SelectFilter 
            selectedElements={selectedprovinces} 
            handleChange={(event) => handleChange(event, false)} 
            elementToChoose={Object.keys({...provincesOptions, "all":"Todas"})} 
            optionMap={{...provincesOptions, "all":"Todas"}}
            label="Provincias"
            disabled={isLoading}
            />
          <SelectFilter
            selectedElements={selectedIsCapital}
            handleChange={(event) => handleChange(event, true)}
            elementToChoose={Object.keys(capitalOptions)}
            label="Capital"
            optionMap={capitalOptions}
            multiple={false}
            disabled={isLoading}
            />
          <SelectFilter
            selectedElements={smartMode}
            handleChange={(event) => setSmartMode(event.target.value)}
            elementToChoose={["No", "Si"]}
            label="Modo Inteligente"
            multiple={false}
            disabled={isLoading}
          />

        </Box>
        <LineGraph selectedprovinces={selectedprovinces} data={trendData} 
        activeDotSelector={'all'} 
        yAxisOptions={["price_euro_mean_excluding_outliers","count","price_per_m2","price_per_hab"]} 
        yAxisDefault={"price_euro_mean_excluding_outliers"}
        height={300}
        isLargeScreen={isLargeScreen}
        />
      </Box>
    )
  }

  return (
    <span>
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
      {isLargeScreen && Filters()}
      <Box mt={6}> 
        <Listing data={bestFlats} isCapital={selectedIsCapital} singleColumn={false}/>
      </Box>
    </span>
  )
}

export default Home;






