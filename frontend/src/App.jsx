import { useState } from 'react';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from './components/Home';
import FlatDetailed from './components/FlatDetailed';
import Flats from './components/Flats';
import Trends from './components/Trends';
import Contact from  './components/Contact';
import Footer from './components/Footer';
import { AppBar, Toolbar, Button, CssBaseline, IconButton, useTheme, useMediaQuery, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Tune';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const appBarStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    color: theme.palette.text.primary,
    boxShadow: 'none', // Removes the shadow
    backdropFilter: 'blur(10px)', // Ensures text is legible on the transparent background
  };

  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={appBarStyle}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button color={location.pathname === '/' ? 'primary' : 'inherit'} component={Link} to="/" sx={{ fontWeight: 700 }}>INICIO</Button>
          <Button color={location.pathname.startsWith('/flats') ? 'primary' : 'inherit'} component={Link} to="/flats" sx={{ fontWeight: 700 }}>EXPLORA</Button>
          <Button color={location.pathname === '/trends' ? 'primary' : 'inherit'} component={Link} to="/trends" sx={{ fontWeight: 700 }}>VISUALIZA</Button>
          <Button color={location.pathname === '/contact' ? 'primary' : 'inherit'} component={Link} to="/contact" sx={{ fontWeight: 700 }}>INFO</Button>
          {!isLargeScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <SettingsIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1 }}>

        <Routes>
          <Route path="/flats/:id" element={<FlatDetailed />} />
          <Route path="/flats" element={<Flats errorMessage={errorMessage} drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/trends" element={<Trends drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/contact" element={<Contact drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/" element={<Home drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
