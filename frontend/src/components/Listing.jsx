import Flat from './Flat';
import Grid from '@mui/material/Grid';

const Listing = ({ data, isCapital, singleColumn = true }) => {
    const provinceCount = Object.keys(data).length;

    const getGridSize = () => {
        if (singleColumn || provinceCount === 1) {
            return 12; // Full width for single column or one province
        } else if (provinceCount === 2) {
            return 6; // Half width for two provinces
        }
        return 4; // Default for more than two provinces
    };

    const getGridSizeSm = () => {
        if (singleColumn || provinceCount === 1) {
            return 12; // Full width for single column or one province
        } 
        return 6; // Default for more than two provinces
    };

    const gridSize = getGridSize();
    const gridSizeSm = getGridSizeSm();

    return (
        <Grid container spacing={2}>
            {Object.entries(data).map(([province, flats]) => (
                <Grid item xs={12} sm={gridSizeSm} md={gridSizeSm} lg={gridSize} key={`${province}-${isCapital}`}>
                    <ul>
                        {flats.map(flatData => (
                            <Grid container item xs={12} key={flatData.id}>
                                <Flat flat={flatData} />
                            </Grid>
                        ))}
                    </ul>
                </Grid>
            ))}
        </Grid>
    );
}

export default Listing;
