import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

const SelectFilter = ({ selectedElements, handleChange, elementToChoose, label, multiple = true }) => {
  return (
    <FormControl style={{ minWidth: 120, marginTop: 40 }}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        multiple={multiple}
        value={selectedElements}
        onChange={handleChange}
        renderValue={multiple ? (selected => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selected.map(value => (
              <Chip key={value} label={value} style={{ margin: 2 }} />
            ))}
          </div>
        )) : undefined}
      >
        {elementToChoose.map(name => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;


