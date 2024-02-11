import { useState } from 'react'
import { Box, Grid } from '@mui/material'
import SelectFilter from './SelectFilter'
import SpainMap from './Map'
import CategoricalBarChart from './BarGraph'
import { categoryOptions } from '../utils/selectors_options.js'


const CategoricalGraphContainer = ({ selectedprovinces, aggData, trendData }) => {
    const [selectedCategories, setSelectedCategories] = useState([]) // Added this state
  
    const filteredData = trendData
      .filter(flat => flat.updated_month_group === 'all')
      .filter(item => 
        selectedprovinces.includes(item.province_group) || selectedprovinces.includes("all"))
    
    const aggDataFiltered = aggData
      .filter(flat => flat.updated_month_group === 'all')
    
    // Move the color generation logic here
    const generateColorArray = (numColors) => {
      const colors = []
      const hueStep = 360 / numColors
  
      for (let i = 0 ; i < numColors ; i++) {
        const hue = i * hueStep
        colors.push(`hsl(${hue}, 100%, 70%)`)
      }
      return colors
    }
  
    const categoryColors = generateColorArray(selectedCategories.length)
      // Create a mapping of categories to their respective colors
      const categoryColorMapping = selectedCategories.reduce((acc, category, index) => {
        acc[category] = categoryColors[index % categoryColors.length]
        return acc
      }, {})
  
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
    )
}


export default CategoricalGraphContainer