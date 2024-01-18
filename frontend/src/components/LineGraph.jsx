import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';




const LineGraph = ({selectedCities, data, activeDotSelector, yAxisOptions, yAxisDefault}) => {
  const [yAxisKey, setYAxisKey] = useState([yAxisDefault]); // Default to the first option

  // Transform the data to the required format
  const transformData = (rawData) => {
    const monthMap = {}

    rawData.forEach(item => {
      const month = item.updated_month_group;
      // Skip the entry if the month is 'all'
      if (month === 'all') {
        return
      }

      if (!monthMap[month]) {
        monthMap[month] = { name: month }
      }
      monthMap[month][item.city_group] = item[yAxisKey];
      //monthMap[month][item.city_group] = item.price_euro_mean_excluding_outliers;
    })

    return Object.values(monthMap)
  }

  const transformedData = transformData(data)

  // Function to generate a unique stroke color for each line
  const getStrokeColor = (city) => {
    // A simple hash function to convert a string to a color
    const hashStringToColor = (str) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash // Convert to 32bit integer
      }
      let color = '#'
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 255
        color += ('00' + value.toString(16)).substr(-2);
      }
      return color
    };
  
    return hashStringToColor(city);
  };
  
  const handleYAxisChange = (event) => {
    setYAxisKey(event.target.value);
  };

  return (
    <div>
      <FormControl style={{ minWidth: 120, margin: '20px' }}>
        <InputLabel id="y-axis-select-label">Y-Axis Key</InputLabel>
        <Select
          labelId="y-axis-select-label"
          id="y-axis-select"
          value={yAxisKey}
          onChange={handleYAxisChange}
        >
          {yAxisOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          width={500}
          height={300}
          data={transformedData}
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
    </div>
  );
};

export default LineGraph;