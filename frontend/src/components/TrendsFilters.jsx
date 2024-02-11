import SelectFilter from './SelectFilter'
import { Box, Grid } from '@mui/material'
import { provincesOptions2, capitalOptions, activityOptions, typesOptions} from '../utils/selectors_options.js'

const TrendsFilters = ({isLargeScreen, 
    selectedRegion, handleRegionChange, 
    selectedprovinces, setSelectedprovinces, regionToProvincesMap,
    selectedIsCapital, setSelectedIsCapital, 
    selectedType, setSelectedType, selectedActivity, setSelectedActivity
    }) => {
      
    return (
        <Box sx={{ width: isLargeScreen ? '100%':'70%', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'unset' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedRegion}
                        handleChange={handleRegionChange}
                        elementToChoose={Object.keys(regionToProvincesMap)}
                        label="Comunidad Autónoma"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SelectFilter
                        selectedElements={selectedprovinces}
                        handleChange={(event) => setSelectedprovinces(event.target.value)}
                        elementToChoose={Object.keys(provincesOptions2)}
                        optionMap = {provincesOptions2}
                        label="Provincias"
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedIsCapital}
                        handleChange={(event) => setSelectedIsCapital(event.target.value)}
                        elementToChoose={Object.keys(capitalOptions)}
                        optionMap = {capitalOptions}
                        label="Capital"
                        multiple={false}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedType}
                        handleChange={(event) => setSelectedType(event.target.value)}
                        elementToChoose={Object.keys(typesOptions)}
                        optionMap={typesOptions}
                        label="Tipo de inmueble"
                        multiple={false}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <SelectFilter
                        selectedElements={selectedActivity}
                        handleChange={(event) => setSelectedActivity(event.target.value)}
                        elementToChoose={Object.keys(activityOptions)}
                        optionMap={activityOptions}
                        label="Activo"
                        multiple={false}
                    />
                </Grid>
            </Grid>
        </Box>
    )
  }


export default TrendsFilters