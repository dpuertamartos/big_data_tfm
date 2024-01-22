import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from './components/Home';
import FlatDetailed from './components/FlatDetailed';
import Flats from './components/Flats';
import Trends from './components/Trends';
import Footer from './components/Footer';
import { AppBar, Toolbar, Button, CssBaseline, Container, IconButton, useTheme, useMediaQuery, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/flats">Explore</Button>
            <Button color="inherit" component={Link} to="/trends">Trends</Button>
            <Button color="inherit" component={Link} to="/">Contact</Button>
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
      <Container>
        <Routes>
          <Route path="/flats/:id" element={<FlatDetailed />} />
          <Route path="/flats" element={<Flats errorMessage={errorMessage} drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
};

export default App;
