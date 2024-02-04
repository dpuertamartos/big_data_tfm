import { useState, useEffect } from 'react';
import trendService from '../services/trends'; // Adjust path as needed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectFilter from './SelectFilter'
import provinces from '../../provinces.json'
import LineGraph from './LineGraph'
import SpainMap from './Map';
import { useTheme, useMediaQuery, Drawer, Box, Grid } from '@mui/material'
import { provincesOptions2, capitalOptions, activityOptions, typesOptions, categoryOptions, factsOptions } from '../utils/selectors_options.js'


const CategoricalBarChart = ({ filteredData, selectedCategories, categoryColorMapping }) => {


    const formatYAxisTick = (value) => `${(value * 100).toFixed(0)}%`;


    return (
      <ResponsiveContainer width="100%" height={425}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          dataKey="province_group" 
          interval={0} // Display all ticks
          tick={{ 
            angle: -45, 
            textAnchor: 'end',
            style: { fontSize: '11px' } // Smaller font size for tick labels
          }} 
          height={60} // Adjust height if needed
            />
          <YAxis tickFormatter={formatYAxisTick} />
          <Tooltip />
          <Legend formatter={(value) => categoryOptions[value] || value} />
          {selectedCategories.map(category => (
            <Bar key={category} dataKey={category} fill={categoryColorMapping[category]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const NumericalGraphContainer = ({ aggData, selectedprovinces, selectedRegions, regionToProvincesMap, isLargeScreen }) => {
    return (
      <Box>
        <LineGraph
          selectedprovinces={selectedprovinces}
          data={aggData}
          activeDotSelector={'all'}
          yAxisOptions={[
            "price_euro_mean_excluding_outliers",
            "superficie_construida_m2_mean_excluding_outliers",
            "superficie_util_m2_mean_excluding_outliers",
            "superficie_solar_m2_mean_excluding_outliers",
            "habitaciones_mean_excluding_outliers",
            "banos_mean_excluding_outliers",
            "gastos_de_comunidad_cleaned_mean_excluding_outliers",
            "count",
            "price_per_m2",
            "price_per_hab",
            "price_per_wc"
          ]}
          yAxisDefault={"price_euro_mean_excluding_outliers"}
          selectedRegions={selectedRegions}
          regionToProvincesMap={regionToProvincesMap}
          height={300}
          isLargeScreen={isLargeScreen}
        />
      </Box>
    );
};

const CategoricalGraphContainer = ({ selectedprovinces, aggData, trendData }) => {
  const [selectedCategories, setSelectedCategories] = useState([]); // Added this state

  const filteredData = trendData
    .filter(flat => flat.updated_month_group === 'all')
    .filter(item => 
      selectedprovinces.includes(item.province_group) || selectedprovinces.includes("all"));
  
  const aggDataFiltered = aggData
    .filter(flat => flat.updated_month_group === 'all')
  
  // Move the color generation logic here
  const generateColorArray = (numColors) => {
    const colors = [];
    const hueStep = 360 / numColors;

    for (let i = 0; i < numColors; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 100%, 70%)`);
    }

    return colors;
  };

  const categoryColors = generateColorArray(selectedCategories.length);

    // Create a mapping of categories to their respective colors
    const categoryColorMapping = selectedCategories.reduce((acc, category, index) => {
      acc[category] = categoryColors[index % categoryColors.length];
      return acc;
    }, {});
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
        <SelectFilter
            selectedElements={selectedCategories}
            handleChange={(event) => setSelectedCategories(event.target.value)}
            elementToChoose={Object.keys(categoryOptions)}
            optionMap={categoryOptions}
            label="Categoría a mostrar"
            />
            </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <CategoricalBarChart 
            filteredData={aggDataFiltered} 
            selectedCategories={selectedCategories} 
            categoryColorMapping={categoryColorMapping} 
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <SpainMap 
            filteredData={filteredData} 
            selectedCategories={selectedCategories} 
            categoryColorMapping={categoryColorMapping} 
          />
        </Grid>

      </Grid>
    </Box>
  );
}

const Trends = ({ drawerOpen, handleDrawerToggle }) => {
  const [trendData, setTrendData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedprovinces, setSelectedprovinces] = useState(["all"])
  const [selectedType, setSelectedType] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedIsCapital, setSelectedIsCapital] = useState("all");

  useEffect(() => {
    fetchTrendData(selectedActivity, selectedType, selectedIsCapital);
  }, [selectedActivity, selectedType, selectedIsCapital]);

  const fetchTrendData = async (activity, type, isCapital) => {
    try {
      const data = await trendService.get({ active: activity, type: type, isCapital: isCapital });
      setTrendData(data);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  const getFilteredData = () => {
    return trendData.filter(item => 
      selectedprovinces.includes(item.province_group) 
    )
  }

  const getAggregatedData = (data) => {

      const aggregateRegionData = (existingData, newItem) => {
        const fieldsToAverage = Object.keys(categoryOptions).concat(Object.keys(factsOptions));
      
        let aggregatedData = { ...existingData, count: existingData.count + 1 };
      
        fieldsToAverage.forEach(field => {
          aggregatedData[field] = ((aggregatedData[field] * (aggregatedData.count - 1)) + newItem[field]) / aggregatedData.count;
        });
      
        return aggregatedData;
      };
      
      const getRegionForProvince = (province) => {
        for (const [region, provinces] of Object.entries(regionToProvincesMap)) {
          if (provinces.includes(province)) {
            return region;
          }
        }
        return null;
      };
      let aggregatedData = {};
      let nonAggregatedData = [];
    
      data.forEach(item => {
        const region = getRegionForProvince(item.province_group);
        const monthGroup = item.updated_month_group;
        
        // Check if the province's region is selected
        if (region && selectedRegion.includes(region)) {
          const key = `${region}_${monthGroup}`;
    
          if (!aggregatedData[key]) {
            aggregatedData[key] = { ...item, count: 1, region: region, province_group: region };
          } else {
            aggregatedData[key] = aggregateRegionData(aggregatedData[key], item);
          }
        } else {
          nonAggregatedData.push({...item, province_group:provincesOptions2[item.province_group]});
        }
      });
      
      
      // Combine aggregated and non-aggregated data
      return [...Object.values(aggregatedData), ...nonAggregatedData];
  };

  const handleRegionChange = (event) => {
    const newSelectedRegions = event.target.value;
    setSelectedRegion(newSelectedRegions);
  
    let updatedProvinces = new Set(selectedprovinces);
  
    newSelectedRegions.forEach(region => {
      const provincesFromRegion = regionToProvincesMap[region] || [];
      provincesFromRegion.forEach(province => updatedProvinces.add(province));
    });
  
    const deselectedRegions = selectedRegion.filter(region => !newSelectedRegions.includes(region));
  
    deselectedRegions.forEach(region => {
      const provincesFromRegion = regionToProvincesMap[region] || [];
      provincesFromRegion.forEach(province => updatedProvinces.delete(province));
    });
  
    setSelectedprovinces(Array.from(updatedProvinces));
  };

  const regionToProvincesMap = provinces.ccaa_to_provinces
  const filteredData = getFilteredData()
  const aggregatedData = getAggregatedData(filteredData)
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));


  const Filters = () => {
    return (
        <Box sx={{ width: isLargeScreen ? '100%':'70%', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'unset' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <SelectFilter
                        selectedElements={selectedRegion}
                        handleChange={handleRegionChange}
                        elementToChoose={Object.keys(regionToProvincesMap)}
                        label="Comunidad Autónoma"
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <SelectFilter
                        selectedElements={selectedprovinces}
                        handleChange={(event) => setSelectedprovinces(event.target.value)}
                        elementToChoose={Object.keys(provincesOptions2)}
                        optionMap = {provincesOptions2}
                        label="Provincias"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedIsCapital}
                        handleChange={(event) => setSelectedIsCapital(event.target.value)}
                        elementToChoose={Object.keys(capitalOptions)}
                        optionMap = {capitalOptions}
                        label="Capital"
                        multiple={false}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedType}
                        handleChange={(event) => setSelectedType(event.target.value)}
                        elementToChoose={Object.keys(typesOptions)}
                        optionMap={typesOptions}
                        label="Tipo de inmueble"
                        multiple={false}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedActivity}
                        handleChange={(event) => setSelectedActivity(event.target.value)}
                        elementToChoose={Object.keys(activityOptions)}
                        optionMap={activityOptions}
                        label="Activo"
                        multiple={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

  return (
    <Box sx={{ flexGrow: 1, pb: 90 }}>
      <Box width="100%" height={300}>
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
        <NumericalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} 
        selectedRegions={selectedRegion} regionToProvincesMap={regionToProvincesMap} 
        isLargeScreen={isLargeScreen}
        />
        <CategoricalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} trendData={filteredData} />
      </Box>
    </Box>
  );
};

export default Trends;
