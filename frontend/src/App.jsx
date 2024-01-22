import { useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from './components/Home';
import FlatDetailed from './components/FlatDetailed';
import Flats from './components/Flats';
import Trends from './components/Trends';
import Footer from './components/Footer';
import { AppBar, Toolbar, Button, CssBaseline, Container } from '@mui/material';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/flats">
            Explore
          </Button>
          <Button color="inherit" component={Link} to="/trends">
            Trends
          </Button>
          <Button color="inherit" component={Link} to="/">
            Contact
          </Button>                         
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Routes>
          <Route path="/flats/:id" element={<FlatDetailed />} />
          <Route path="/flats" element={<Flats errorMessage={errorMessage} />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
};

export default App;
