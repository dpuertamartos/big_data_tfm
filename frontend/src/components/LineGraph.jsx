import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const LineGraph = ({selectedCities, data, activeDotSelector}) => {

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
              activeDot={city === activeDotSelector ? { r: 8 } : null}
            />
          ))} 
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;