import Flat from './Flat';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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
        if (singleColumn || provinceCount <= 2) {
            return 12; // Full width for single column or up to two provinces
        }
        return 6; // Half width for more than two provinces
    };

    const gridSize = getGridSize();
    const gridSizeSm = getGridSizeSm();

    const formatProvince = (province) => {
        return province
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // Capitalize first letter of each word
    };

    return (
        <Grid container spacing={2}>
            {Object.entries(data).map(([province, flats]) => (
                <Grid item xs={12} sm={gridSizeSm} md={gridSize} key={`${province}-${isCapital}`}>
                    {!singleColumn && (
                        <Typography variant="h4" align="center" sx={{ mb: 2,  color: 'primary.main', fontWeight: 'bold'}}>
                            {formatProvince(province)} {isCapital === '1' ? '(Capital)' : isCapital === '0' ? '(Fuera de la Capital)' : ''}
                        </Typography>
                    )}
                    <ul>
                        {flats.map(flatData => (
                            <Grid container item xs={12} key={flatData.id}>
                                <Flat key={flatData.id} flat={flatData} />
                            </Grid>
                        ))}
                    </ul>
                </Grid>
            ))}
        </Grid>
    );
}

export default Listing;

