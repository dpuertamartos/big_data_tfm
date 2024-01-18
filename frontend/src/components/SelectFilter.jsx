import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

const SelectFilter = ({selectedElements, handleChange, elementToChoose, label} ) => {
    return (
        <FormControl style={{ minWidth: 120, marginTop: 40 }}>
            <InputLabel id="demo-mutiple-chip-label">{label}</InputLabel>
            <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={selectedElements}
            onChange={handleChange}
            renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected.map((value) => (
                    <Chip key={value} label={value} style={{ margin: 2 }} />
                ))}
                </div>
            )}
            >
            {elementToChoose.map((name) => (
                <MenuItem key={name} value={name}>
                {name}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
    )
}  

export default SelectFilter

