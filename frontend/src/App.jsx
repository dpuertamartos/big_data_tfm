import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from './components/Home';
import FlatDetailed from './components/FlatDetailed';
import Flats from './components/Flats';
import Trends from './components/Trends';
import Contact from  './components/Contact';
import Footer from './components/Footer';
import { AppBar, Toolbar, Button, CssBaseline, Container, IconButton, useTheme, useMediaQuery, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Tune';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">Inicio</Button>
            <Button color="inherit" component={Link} to="/flats">Explora</Button>
            <Button color="inherit" component={Link} to="/trends">Visualiza</Button>
            <Button color="inherit" component={Link} to="/contact">Info</Button>
          </Box>
          {!isLargeScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ fontSize: '1.5rem' }} // Larger icon size
            >
              <SettingsIcon /> 
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      <Container>
        <Routes>
          <Route path="/flats/:id" element={<FlatDetailed />} />
          <Route path="/flats" element={<Flats errorMessage={errorMessage} drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/trends" element={<Trends drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/contact" element={<Contact drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/" element={<Home drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
        </Routes>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
