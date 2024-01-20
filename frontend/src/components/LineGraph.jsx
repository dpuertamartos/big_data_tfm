import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LineGraph = ({ selectedCities, data, activeDotSelector, yAxisOptions, yAxisDefault }) => {
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
      monthMap[month][item.city_group] = item[yAxisKey];
    });

    return Object.values(monthMap);
  };

  // Function to generate a unique stroke color for each line
  const getStrokeColor = (city) => {
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
    return hashStringToColor(city);
  };

  const handleYAxisChange = (event) => {
    const newKeys = event.target.value;
    if (newKeys.length <= 3) { // Limit to a maximum of 3 yAxisKeys
      setSelectedYAxisKeys(newKeys);
    }
  };

  // Calculate the width for each chart based on the number of selected yAxisKeys
  const chartWidth = selectedYAxisKeys.length === 1 ? '100%' : `${100 / selectedYAxisKeys.length}%`;

  return (
    <div>
      <FormControl style={{ minWidth: 120, margin: '20px' }}>
        <InputLabel id="y-axis-select-label">Y-Axis Keys</InputLabel>
        <Select
          labelId="y-axis-select-label"
          id="y-axis-select"
          multiple
          value={selectedYAxisKeys}
          onChange={handleYAxisChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {yAxisOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        {selectedYAxisKeys.map((yAxisKey, index) => (
          <ResponsiveContainer key={index} width={chartWidth} height={500}>
            <LineChart
              data={transformData(data, yAxisKey)}
              margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedCities.map(city => (
                <Line 
                  key={city}
                  type="monotone" 
                  dataKey={city} 
                  stroke={getStrokeColor(city)} 
                  activeDot={city === activeDotSelector ? { r: 8 } : null}
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
