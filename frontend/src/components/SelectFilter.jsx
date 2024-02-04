import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';

const SelectFilter = ({ selectedElements, handleChange, elementToChoose, label, optionMap = false, multiple = true, disabled = false }) => {
  // Verifica si hay elementos seleccionados
  const hasSelection = multiple ? selectedElements.length > 0 : selectedElements !== "";

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel
        id={`select-label-${label}`}
        sx={{
          ...(hasSelection && {
            color: 'primary.main', // Cambia a color primario si hay selección
            fontSize: '1.3rem', // Aumenta el tamaño de la fuente
            fontWeight: 'bold',
            transform: 'translate(0, -20px) scale(0.85)'  // Hace la fuente en negrita
          }),
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        multiple={multiple}
        value={selectedElements}
        onChange={handleChange}
        renderValue={multiple ? (selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {selected.map(value => (
              <Chip key={value} label={optionMap[value]?optionMap[value]:value} sx={{ m: 0.5 }} />
            ))}
          </Box>
        )) : undefined}
        disabled={disabled}
      >
        {elementToChoose.map(name => (
          <MenuItem key={name} value={name}>
            {optionMap&&optionMap[name]?optionMap[name]:name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;



