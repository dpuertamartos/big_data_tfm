import SelectFilter from './SelectFilter'
import { Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Typography, Container } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { capitalOptions, provincesOptions} from '../utils/selectors_options.js'


const HomeFilters = ({ isLargeScreen, selectedprovinces, handleChange, isLoading, selectedIsCapital, smartMode, setSmartMode, 
    openHelpDialog, handleOpenHelpDialog, handleCloseHelpDialog }) => {
    
    return (
        <Container sx={{ width: '100%', p: 2, mb: "5%" }}>
          <Box sx={{ display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column', gap: isLargeScreen ? 4 : 0}}>
            <SelectFilter 
              selectedElements={selectedprovinces} 
              handleChange={(event) => handleChange(event, false)} 
              elementToChoose={Object.keys({...provincesOptions, "all":"Todas"})} 
              optionMap={{...provincesOptions, "all":"Todas"}}
              label="Provincias"
              disabled={isLoading}
              />
            <SelectFilter
              selectedElements={selectedIsCapital}
              handleChange={(event) => handleChange(event, true)}
              elementToChoose={Object.keys(capitalOptions)}
              label="Capital"
              optionMap={capitalOptions}
              multiple={false}
              disabled={isLoading}
              />
                  
            <SelectFilter
              selectedElements={smartMode}
              handleChange={(event) => setSmartMode(event.target.value)}
              elementToChoose={["No", "Si"]}
              label="Modo Inteligente"
              multiple={false}
              disabled={isLoading}
            />
            <Tooltip title="Más información sobre selectores y Modo Inteligente">
              <IconButton onClick={handleOpenHelpDialog} size="small" color="primary" sx={{ ml: 1 }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          
  
          {/* Diálogo de ayuda para Modo Inteligente */}
          <Dialog open={openHelpDialog} onClose={handleCloseHelpDialog}>
            <DialogTitle>{"Modo Inteligente"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography variant="body1" gutterBottom>El &aposModo Inteligente&apos ajusta el filtro de puntuación a un máximo de 0.33. Esto equivale a inmuebles cuyo precio estimado por el algoritmo es un 33% superior a su precio REAL de venta. 
    </Typography>
                <Typography variant="body1" gutterBottom>Se asigna un máximo de 0.33 de forma arbitraria. Se ha observado que inmuebles con una puntuación superior suele ser por errores en el listado de detalles (en el anuncio) y/o por omisión de detalles que bajan mucho su valor real.</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseHelpDialog}>Cerrar</Button>
            </DialogActions>
          </Dialog>
          </Box>
        </Container>
      )
  }

export default HomeFilters