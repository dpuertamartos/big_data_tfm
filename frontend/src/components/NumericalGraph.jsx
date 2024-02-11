import LineGraph from './LineGraph'
import { Box } from '@mui/material'

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
          yAxisDefault={["price_euro_mean_excluding_outliers", "price_per_m2"]}
          selectedRegions={selectedRegions}
          regionToProvincesMap={regionToProvincesMap}
          height={isLargeScreen?300:200}
          isLargeScreen={isLargeScreen}
        />
      </Box>
    )
}

export default NumericalGraphContainer