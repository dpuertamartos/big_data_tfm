import { useState, useEffect } from 'react';
import trendService from '../services/trends'; // Adjust path as needed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectFilter from './SelectFilter'
import provinces from '../../provinces.json'
import LineGraph from './LineGraph'
import SpainMap from './Map';
import { useTheme, useMediaQuery, Drawer } from '@mui/material'


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
          <Legend />
          {selectedCategories.map(category => (
            <Bar key={category} dataKey={category} fill={categoryColorMapping[category]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const NumericalGraphContainer = ({ aggData, selectedprovinces, selectedRegions, regionToProvincesMap }) => {
    return (
      <>
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
        />
      </>
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
    .filter(item => selectedprovinces.includes(item.province_group) || selectedprovinces.includes("all"));
  
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
    <>
      <SelectFilter
          selectedElements={selectedCategories}
          handleChange={(event) => setSelectedCategories(event.target.value)}
          elementToChoose={["exterior_summary_no_pct","exterior_summary_yes_pct","vidrios_dobles_summary_no_pct","vidrios_dobles_summary_yes_pct","adaptado_a_personas_con_movilidad_reducida_summary_no_pct","adaptado_a_personas_con_movilidad_reducida_summary_yes_pct","puerta_blindada_summary_no_pct","puerta_blindada_summary_yes_pct","ascensor_summary_no_pct","ascensor_summary_yes_pct","balcon_summary_no_pct","balcon_summary_yes_pct","portero_automatico_summary_no_pct","portero_automatico_summary_yes_pct","garaje_summary_no_pct","garaje_summary_yes_pct","comedor_summary_no_pct","comedor_summary_yes_pct","terraza_summary_no_pct","terraza_summary_yes_pct","jardin_summary_no_pct","jardin_summary_yes_pct","armarios_empotrados_summary_no_pct","armarios_empotrados_summary_yes_pct","aire_acondicionado_summary_yes_pct","aire_acondicionado_summary_no_pct","trastero_summary_no_pct","trastero_summary_yes_pct","piscina_summary_no_pct","piscina_summary_yes_pct","chimenea_summary_no_pct","chimenea_summary_yes_pct","lavadero_summary_no_pct","lavadero_summary_yes_pct","soleado_summary_no_pct","soleado_summary_yes_pct","gas_summary_no_pct","gas_summary_yes_pct  ","amueblado_summary_no_pct","amueblado_summary_yes_pct","cocina_equipada_summary_no_pct","cocina_equipada_summary_yes_pct","calefaccion_summary_no_pct","calefaccion_summary_gas_natural_pct","calefaccion_summary_gasoil_pct","calefaccion_summary_central_pct","calefaccion_summary_otros_pct","calefaccion_summary_electrica_pct","calefaccion_summary_gas_pct","conservacion_desconocido_pct","conservacion_reformado_pct","conservacion_en_buen_estado_pct","conservacion_a_reformar_pct","conservacion_a_estrenar_pct","antiguedad_desconocido_pct","antiguedad_mas_de_50_anos_pct","antiguedad_entre_20_y_30_anos_pct","antiguedad_entre_10_y_20_anos_pct","antiguedad_entre_30_y_50_anos_pct","antiguedad_menos_de_5_anos_pct","antiguedad_entre_5_y_10_anos_pct","carpinteria_exterior_cleaned_desconocido_pct","carpinteria_exterior_cleaned_aluminio_pct","carpinteria_exterior_cleaned_climalit_pct","carpinteria_exterior_cleaned_pvc_pct","carpinteria_exterior_cleaned_otros_pct","carpinteria_exterior_cleaned_madera_pct","tipo_suelo_summary_gres_pct","tipo_suelo_summary_tarima_flotante_pct","tipo_suelo_summary_desconocido_pct","tipo_suelo_summary_otros_pct","tipo_suelo_summary_terrazo_pct","tipo_suelo_summary_parquet_pct","tipo_suelo_summary_marmol_pct","tipo_suelo_summary_ceramica_pct","cocina_summary_desconocido_pct","cocina_summary_otros_pct","cocina_summary_independiente_pct","cocina_summary_individual_pct","cocina_summary_americana_pct","cocina_summary_amueblada_pct","orientacion_summary_desconocido_pct","orientacion_summary_noreste_pct","orientacion_summary_otros_pct","orientacion_summary_sur_pct","orientacion_summary_noroeste_pct","orientacion_summary_norte_pct","orientacion_summary_sureste_pct","orientacion_summary_oeste_pct"]}
          label="category"
          />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ flex: '1' }}>
          <CategoricalBarChart 
            filteredData={aggDataFiltered} 
            selectedCategories={selectedCategories} 
            categoryColorMapping={categoryColorMapping} 
          />
        </div>
        <div style={{ flex: '1' }}>
          <SpainMap 
            filteredData={filteredData} 
            selectedCategories={selectedCategories} 
            categoryColorMapping={categoryColorMapping} 
          />
        </div>
      </div>
    </>
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
        const fieldsToAverage = [
          "price_euro_mean_excluding_outliers",
          // ... other numeric fields to average ...
        ];
      
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
          nonAggregatedData.push(item);
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

  return (
    <div>
      <h2>Trends Dashboard</h2>
      <ResponsiveContainer width="100%" height={300}>
          <Drawer
                variant="temporary"
                anchor="top"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                    width: '90%', // Sets the drawer's width to 100%
                    maxHeight: '85vh', // Optional: Restricts the maximum height
                    display: 'flex', // Use flex container
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically
                    margin: 'auto',
                    }
                }}
                >
              <>
                  <SelectFilter
                    selectedElements={selectedRegion}
                    handleChange={handleRegionChange}
                    elementToChoose={Object.keys(regionToProvincesMap)}
                    label="regions"
                  />
                  <SelectFilter
                  selectedElements={selectedprovinces}
                  handleChange={(event) => setSelectedprovinces(event.target.value)}
                  elementToChoose={provinces.locations.concat('all')}
                  label="provinces"
                  />
                  <SelectFilter
                  selectedElements={selectedIsCapital}
                  handleChange={(event) => setSelectedIsCapital(event.target.value)}
                  elementToChoose={["all","0","1"]}
                  label="capital"
                  multiple={false}
                  />
                  <SelectFilter
                  selectedElements={selectedType}
                  handleChange={(event) => setSelectedType(event.target.value)}
                  elementToChoose={["all","apartamento","atico","casa","chalet","duplex","estudio","finca","loft","piso"]}
                  label="type"
                  multiple={false}
                  />
                  <SelectFilter
                  selectedElements={selectedActivity}
                  handleChange={(event) => setSelectedActivity(event.target.value)}
                  elementToChoose={['all','0','1']}
                  label="activity"
                  multiple={false}
                  />
                </>
            </Drawer>
        {isLargeScreen && (
                  <>
                  <SelectFilter
                    selectedElements={selectedRegion}
                    handleChange={handleRegionChange}
                    elementToChoose={Object.keys(regionToProvincesMap)}
                    label="regions"
                  />
                  <SelectFilter
                  selectedElements={selectedprovinces}
                  handleChange={(event) => setSelectedprovinces(event.target.value)}
                  elementToChoose={provinces.locations.concat('all')}
                  label="provinces"
                  />
                  <SelectFilter
                  selectedElements={selectedIsCapital}
                  handleChange={(event) => setSelectedIsCapital(event.target.value)}
                  elementToChoose={["all","0","1"]}
                  label="capital"
                  multiple={false}
                  />
                  <SelectFilter
                  selectedElements={selectedType}
                  handleChange={(event) => setSelectedType(event.target.value)}
                  elementToChoose={["all","apartamento","atico","casa","chalet","duplex","estudio","finca","loft","piso"]}
                  label="type"
                  multiple={false}
                  />
                  <SelectFilter
                  selectedElements={selectedActivity}
                  handleChange={(event) => setSelectedActivity(event.target.value)}
                  elementToChoose={['all','0','1']}
                  label="activity"
                  multiple={false}
                  />
                  </>
        )}
        <NumericalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} selectedRegions={selectedRegion} regionToProvincesMap={regionToProvincesMap} />
        <CategoricalGraphContainer selectedprovinces={selectedprovinces} aggData={aggregatedData} trendData={filteredData}   />
      </ResponsiveContainer>
    </div>
  );
};

export default Trends;
