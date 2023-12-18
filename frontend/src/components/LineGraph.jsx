import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';


const LineGraph = ({selectedCities, handleChange, data, cities}) => {

  // Function to generate a unique stroke color for each line
  const getStrokeColor = (city) => {
    // A simple hash function to convert a string to a color
    const hashStringToColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
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
  

  return (
    <div style={{ width: '100%', height: 500 }}>
      <FormControl style={{ minWidth: 120, marginTop: 40 }}>
        <InputLabel id="demo-mutiple-chip-label">Cities</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selectedCities}
          onChange={handleChange}
          renderValue={(selected) => (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {selected.map((value) => (
                <Chip key={value} label={value} style={{ margin: 2 }} />
              ))}
            </div>
          )}
        >
          {cities.locations.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
              activeDot={city === 'madrid' ? { r: 8 } : null}
            />
          ))} 
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;