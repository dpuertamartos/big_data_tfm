import React, { useState, useEffect } from 'react';
import trendService from '../services/trends'; // Adjust path as needed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectFilter from './SelectFilter'
import cities from '../../cities.json'
import LineGraph from './LineGraph'
import SpainMap from './Map';

//
//TODO1: TOP FILTER INCLUDE TIME
//TODO2 The numerical PART will have a graph and a numeric aggregator/map - 
//TODO3: The categorical variables will have a graph and a map
//TODO4: Each A and B can have dimension selected which will change the type of graph (time line graph, city map, type bar with drawings in X axis?)
//MAP ALWAYS PRESENT IF TIME DIMENSION SHOW TIME = 'ALL' TYPE 'ALL', IF TYPE DIMENSION SHOW TIME 'ALL' CITY WHERE


const CategoricalBarChart = ({ data, selectedCities }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const generateColorArray = (numColors) => {
        const colors = [];
        const hueStep = 360 / numColors;
      
        for (let i = 0; i < numColors; i++) {
          const hue = i * hueStep;
          colors.push(`hsl(${hue}, 100%, 70%)`);
        }
      
        return colors;
      };
    
    const formatYAxisTick = (value) => `${(value * 100).toFixed(0)}%`;

    const colors = generateColorArray(selectedCategories.length);
    // Filter data to include only selected cities
    const filteredData = data.filter(item => 
        selectedCities.includes(item.city_group) || selectedCities.includes("all")
    );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <SelectFilter
        selectedElements={selectedCategories}
        handleChange={(event) => setSelectedCategories(event.target.value)}
        elementToChoose={["exterior_summary_no_pct","exterior_summary_yes_pct","vidrios_dobles_summary_no_pct","vidrios_dobles_summary_yes_pct","adaptado_a_personas_con_movilidad_reducida_summary_no_pct","adaptado_a_personas_con_movilidad_reducida_summary_yes_pct","puerta_blindada_summary_no_pct","puerta_blindada_summary_yes_pct","ascensor_summary_no_pct","ascensor_summary_yes_pct","balcon_summary_no_pct","balcon_summary_yes_pct","portero_automatico_summary_no_pct","portero_automatico_summary_yes_pct","garaje_summary_no_pct","garaje_summary_yes_pct","comedor_summary_no_pct","comedor_summary_yes_pct","terraza_summary_no_pct","terraza_summary_yes_pct","jardin_summary_no_pct","jardin_summary_yes_pct","armarios_empotrados_summary_no_pct","armarios_empotrados_summary_yes_pct","aire_acondicionado_summary_yes_pct","aire_acondicionado_summary_no_pct","trastero_summary_no_pct","trastero_summary_yes_pct","piscina_summary_no_pct","piscina_summary_yes_pct","chimenea_summary_no_pct","chimenea_summary_yes_pct","lavadero_summary_no_pct","lavadero_summary_yes_pct","soleado_summary_no_pct","soleado_summary_yes_pct","gas_summary_no_pct","gas_summary_yes_pct  ","amueblado_summary_no_pct","amueblado_summary_yes_pct","cocina_equipada_summary_no_pct","cocina_equipada_summary_yes_pct","calefaccion_summary_no_pct","calefaccion_summary_gas_natural_pct","calefaccion_summary_gasoil_pct","calefaccion_summary_central_pct","calefaccion_summary_otros_pct","calefaccion_summary_electrica_pct","calefaccion_summary_gas_pct","conservacion_desconocido_pct","conservacion_reformado_pct","conservacion_en_buen_estado_pct","conservacion_a_reformar_pct","conservacion_a_estrenar_pct","antiguedad_desconocido_pct","antiguedad_mas_de_50_anos_pct","antiguedad_entre_20_y_30_anos_pct","antiguedad_entre_10_y_20_anos_pct","antiguedad_entre_30_y_50_anos_pct","antiguedad_menos_de_5_anos_pct","antiguedad_entre_5_y_10_anos_pct","carpinteria_exterior_cleaned_desconocido_pct","carpinteria_exterior_cleaned_aluminio_pct","carpinteria_exterior_cleaned_climalit_pct","carpinteria_exterior_cleaned_pvc_pct","carpinteria_exterior_cleaned_otros_pct","carpinteria_exterior_cleaned_madera_pct","tipo_suelo_summary_gres_pct","tipo_suelo_summary_tarima_flotante_pct","tipo_suelo_summary_desconocido_pct","tipo_suelo_summary_otros_pct","tipo_suelo_summary_terrazo_pct","tipo_suelo_summary_parquet_pct","tipo_suelo_summary_marmol_pct","tipo_suelo_summary_ceramica_pct","cocina_summary_desconocido_pct","cocina_summary_otros_pct","cocina_summary_independiente_pct","cocina_summary_individual_pct","cocina_summary_americana_pct","cocina_summary_amueblada_pct","orientacion_summary_desconocido_pct","orientacion_summary_noreste_pct","orientacion_summary_otros_pct","orientacion_summary_sur_pct","orientacion_summary_noroeste_pct","orientacion_summary_norte_pct","orientacion_summary_sureste_pct","orientacion_summary_oeste_pct"]}
        label="category"
        />
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          dataKey="city_group" 
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
          {selectedCategories.map((category, index) => (
            <Bar key={category} dataKey={category} fill={colors[index % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const NumericalGraphContainer = ({ trendData, selectedCities }) => {
    const [selectedDimension, setSelectedDimension] = useState(["location"])


    return (
      <>
        <div>
        <SelectFilter
          selectedElements={selectedDimension}
          handleChange={(event) => setSelectedDimension(event.target.value)}
          elementToChoose={["location","time","type"]}
          label="dimension"
        />
        </div>
        <LineGraph
          selectedCities={selectedCities}
          data={trendData}
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
        />
      </>
    );
};

const CategoricalGraphContainer = ({ selectedCities, trendData }) => {
  const [selectedDimension, setSelectedDimension] = useState(["location"])


  return (
    <>
      <div>
      <SelectFilter
        selectedElements={selectedDimension}
        handleChange={(event) => setSelectedDimension(event.target.value)}
        elementToChoose={["location","time","type"]}
        label="dimension"
      />
      </div>
      {/* <CategoricalBarChart data={trendData.filter(flat => flat.updated_month_group == 'all')} selectedCities={selectedCities}/> */}
      
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <CategoricalBarChart data={trendData} selectedCities={selectedCities} />
        </div>
        <div style={{ flex: '1' }}>
          <SpainMap />
        </div>
      </div>
    </>
  );
}

const Trends = () => {
  const [trendData, setTrendData] = useState([]);
  const [selectedCities, setSelectedCities] = useState(["all"])
  const [selectedType, setSelectedType] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");

  useEffect(() => {
    // Fetch initial data
    fetchTrendData(selectedActivity, selectedType);
  }, [selectedActivity, selectedType]);

  const fetchTrendData = async (activity, type) => {
    try {
      const data = await trendService.get({ active: activity, type: type });
      setTrendData(data);
    } catch (error) {
      console.error("Error fetching trends:", error);
    }
  };

  // Function to transform data here if necessary
    // Filter data based on selected options
  const getFilteredData = () => {
      return trendData.filter(item => 
        selectedCities.includes(item.city_group) 
      );
  };
  
  const filteredData = getFilteredData()
  console.log('filtered', filteredData)

  return (
    <div>
      <h2>Trends Dashboard</h2>
      <ResponsiveContainer width="100%" height={300}>
        <span>filters</span>
        <SelectFilter
        selectedElements={selectedCities}
        handleChange={(event) => setSelectedCities(event.target.value)}
        elementToChoose={cities.locations.concat('all')}
        label="provinces"
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
        <div>numerical part of dashboard</div>
        <NumericalGraphContainer selectedCities={selectedCities} trendData={filteredData}  />
        <div>categorical part of dashboard</div>
        <CategoricalGraphContainer selectedCities={selectedCities} trendData={filteredData}  />
      </ResponsiveContainer>
    </div>
  );
};

export default Trends;
