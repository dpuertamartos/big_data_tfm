import { useState, useEffect } from 'react'
import trendService from '../services/trends' 
import provinces from '../../provinces.json'
import CategoricalGraphContainer from './CategoricalGraph.jsx'
import NumericalGraphContainer from './NumericalGraph.jsx'
import TrendsFilters from './TrendsFilters.jsx'
import { useTheme, useMediaQuery, Drawer, Box } from '@mui/material'
import { provincesOptions2, categoryOptions, factsOptions } from '../utils/selectors_options.js'


const Trends = ({ drawerOpen, handleDrawerToggle }) => {
  const [trendData, setTrendData] = useState([])
  const [selectedRegion, setSelectedRegion] = useState([])
  const [selectedprovinces, setSelectedprovinces] = useState(["all"])
  const [selectedType, setSelectedType] = useState("all")
  const [selectedActivity, setSelectedActivity] = useState("all")
  const [selectedIsCapital, setSelectedIsCapital] = useState("all")
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const regionToProvincesMap = provinces.ccaa_to_provinces

  useEffect(() => {
    fetchTrendData(selectedActivity, selectedType, selectedIsCapital)
  }, [selectedActivity, selectedType, selectedIsCapital])

  const fetchTrendData = async (activity, type, isCapital) => {
    try {
      const data = await trendService.get({ active: activity, type: type, isCapital: isCapital })
      setTrendData(data)
    } catch (error) {
      console.error("Error fetching trends:", error)
    }
  }

  const getFilteredData = () => {
    return trendData.filter(item => 
      selectedprovinces.includes(item.province_group) 
    )
  }

  const getAggregatedData = (data) => {

      const aggregateRegionData = (existingData, newItem) => {
        const fieldsToAverage = Object.keys(categoryOptions).concat(Object.keys(factsOptions))
      
        let aggregatedData = { ...existingData, count: existingData.count + 1 }
      
        fieldsToAverage.forEach(field => {
          aggregatedData[field] = ((aggregatedData[field] * (aggregatedData.count - 1)) + newItem[field]) / aggregatedData.count
        })
      
        return aggregatedData
      }
      
      const getRegionForProvince = (province) => {
        for (const [region, provinces] of Object.entries(regionToProvincesMap)) {
          if (provinces.includes(province)) {
            return region
          }
        }
        return null
      }
      let aggregatedData = {}
      let nonAggregatedData = []
    
      data.forEach(item => {
        const region = getRegionForProvince(item.province_group)
        const monthGroup = item.updated_month_group
        
        // Check if the province's region is selected
        if (region && selectedRegion.includes(region)) {
          const key = `${region}_${monthGroup}`
    
          if (!aggregatedData[key]) {
            aggregatedData[key] = { ...item, count: 1, region: region, province_group: region }
          } else {
            aggregatedData[key] = aggregateRegionData(aggregatedData[key], item)
          }
        } else {
          nonAggregatedData.push({...item, province_group:provincesOptions2[item.province_group]})
        }
      })
      
      
      // Combine aggregated and non-aggregated data
      return [...Object.values(aggregatedData), ...nonAggregatedData]
  }

  const handleRegionChange = (event) => {
      const newSelectedRegions = event.target.value
      setSelectedRegion(newSelectedRegions)

      let updatedProvinces = new Set(selectedprovinces)

      newSelectedRegions.forEach(region => {
        const provincesFromRegion = regionToProvincesMap[region] || []
        provincesFromRegion.forEach(province => updatedProvinces.add(province))
      })

      const deselectedRegions = selectedRegion.filter(region => !newSelectedRegions.includes(region))

      deselectedRegions.forEach(region => {
        const provincesFromRegion = regionToProvincesMap[region] || []
        provincesFromRegion.forEach(province => updatedProvinces.delete(province))
      })

      setSelectedprovinces(Array.from(updatedProvinces))
  }

  const filteredData = getFilteredData()
  const aggregatedData = getAggregatedData(filteredData)

  const filters = () => <TrendsFilters 
    isLargeScreen={isLargeScreen} regionToProvincesMap={regionToProvincesMap} 
    selectedprovinces={selectedprovinces} selectedIsCapital={selectedIsCapital} selectedRegion={selectedRegion} selectedActivity={selectedActivity} selectedType={selectedType}
    setSelectedprovinces={setSelectedprovinces} setSelectedIsCapital={setSelectedIsCapital} handleRegionChange={handleRegionChange} setSelectedType={setSelectedType} setSelectedActivity={setSelectedActivity} 
  />

  return (
    <Box sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      height: isMediumScreen ? '100vh' : 'auto', // Full viewport height on medium screens
    }}>
      <Box width="100%"
            sx={{
              position:'relative',
              '&:before':{
                content: '""',
                display: 'block',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("3_small.jpg")',
                backgroundSize: 'cover', // Keeps the image covering the entire section
                backgroundPosition: 'bottom', // Adjust this value to focus on a specific part of the image (e.g., 'top', 'center', 'bottom')
                color: '#fff',
                opacity: 0.3
            }
            }}
      >
          <Box sx={{position:'relative', py: "2%", px:"10%"}}>
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
                  {filters()}
              </Drawer>
          {isLargeScreen && filters()}
          <NumericalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} 
          selectedRegions={selectedRegion} regionToProvincesMap={regionToProvincesMap} 
          isLargeScreen={isLargeScreen}
          />
          <CategoricalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} trendData={filteredData} />
        </Box>
      </Box>
    </Box>
  )
}

export default Trends
