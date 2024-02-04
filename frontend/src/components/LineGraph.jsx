import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Customized } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { factsOptions, provincesOptions2 } from '../utils/selectors_options.js';


const LineGraph = ({ selectedprovinces, data, activeDotSelector, yAxisOptions, yAxisDefault, regionToProvincesMap, isLargeScreen, selectedRegions = [], height = 500 }) => {
  const [selectedYAxisKeys, setSelectedYAxisKeys] = useState([yAxisDefault]);

  // Transform the data to the required format
  const transformData = (rawData, yAxisKey) => {
    const monthMap = {};

    rawData.forEach(item => {
      const month = item.updated_month_group;
      if (month === 'all') return;

      if (!monthMap[month]) {
        monthMap[month] = { name: month };
      }
      monthMap[month][item.province_group] = item[yAxisKey];
    });

    return Object.values(monthMap);
  };

  // Function to generate a unique stroke color for each line
  const getStrokeColor = (province) => {
    const hashStringToColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      let color = '#';
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 255;
        color += ('00' + value.toString(16)).substr(-2);
      }
      return color;
    };
    return hashStringToColor(province);
  };

  const handleYAxisChange = (event) => {
    const newKeys = event.target.value;
    if (newKeys.length <= 3) { // Limit to a maximum of 3 yAxisKeys
      setSelectedYAxisKeys(newKeys);
    }
  };

  // Calculate the width for each chart based on the number of selected yAxisKeys
  const chartWidth = selectedYAxisKeys.length === 1 ? '100%' : `${100 / selectedYAxisKeys.length}%`;

  const selectedElements = selectedprovinces.filter(province => 
    !selectedRegions.some(region => regionToProvincesMap[region].includes(province))
  ).map(e => provincesOptions2[e]).concat(selectedRegions);

  
  const hasSelection = selectedYAxisKeys.length > 0 

  // Función para extraer las unidades de factsOptions
  const getUnitFromOption = (option) => {
    const match = factsOptions[option].match(/\((.*?)\)/);
    return match ? match[1] : '';
  };

  // Mapeo de los meses en español
  const monthsMap = {
    '01': 'Ene',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Abr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Ago',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dic',
  };

  // Función para transformar el formato de la fecha
  const formatXAxis = (tickItem) => {
    // Dividir el valor de tickItem en año y mes
    const [year, month] = tickItem.split('-');
    // Convertir al formato español
    return `${monthsMap[month]}/${year.substring(2)}`;
  };

  // Adjust flexDirection based on isLargeScreen
  const chartContainerStyle = {
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column', // Dynamically adjust based on screen size
    justifyContent: 'space-around',
    alignItems: 'center'
  };

  

  return (
    <div>
      <FormControl style={{ minWidth: 120, maxWidth: '90%', margin: '20px' }}>
        <InputLabel id="y-axis-select-label" sx={{
          ...(hasSelection && {
            color: 'primary.main', // Cambia a color primario si hay selección
            fontSize: '1.3rem', // Aumenta el tamaño de la fuente
            fontWeight: 'bold',
            transform: 'translate(0, -20px) scale(0.85)',  // Hace la fuente en negrita
          })
        }}>Medidas</InputLabel>
        <Select
          labelId="y-axis-select-label"
          id="y-axis-select"
          multiple
          value={selectedYAxisKeys}
          onChange={handleYAxisChange}
          renderValue={(selected) => selected.map(key => factsOptions[key] || key).join(', ')}
        >
          {yAxisOptions.map((option) => (
            <MenuItem key={option} value={option}>{factsOptions[option]}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={chartContainerStyle}>
        {selectedYAxisKeys.map((yAxisKey, index) => (
            <ResponsiveContainer key={index} width={isLargeScreen ? chartWidth : '100%'} height={height}>
            <LineChart
              data={transformData(data, yAxisKey)}
              margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={formatXAxis} />
              <YAxis label={{ value: getUnitFromOption(yAxisKey), angle: -45, position: 'insideLeft', offset: -14 }} />
              <Tooltip />
              <Legend />
              {/* Agrega Customized para renderizar un título adicional */}
              <Customized component={() => (
                <text x={180} y={20} fill="#666" fontSize="14" fontWeight="bold" textAnchor="middle">{factsOptions[yAxisKey]}</text>
              )} />
              {selectedElements.map(province => (
                <Line 
                  key={province}
                  type="monotone" 
                  dataKey={province} 
                  stroke={getStrokeColor(province)} 
                  activeDot={province === activeDotSelector ? { r: 8 } : null}
                />
              ))}
            </LineChart>
        </ResponsiveContainer>
        ))}
      </div>
    </div>
  );
};

export default LineGraph;
