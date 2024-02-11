
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { categoryOptions} from '../utils/selectors_options.js'


const CategoricalBarChart = ({ filteredData, selectedCategories, categoryColorMapping }) => {

    const formatYAxisTick = (value) => `${(value * 100).toFixed(0)}%`

    return (
      <ResponsiveContainer width="100%" height={325}>
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
    )
  }

  export default CategoricalBarChart