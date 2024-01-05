import { useState } from 'react'
import {
  Routes,
  Route,
  Link
} from "react-router-dom"

import Home from './components/Home'
import FlatDetailed from './components/FlatDetailed'
import Flats from './components/Flats'
import Footer from './components/Footer'


import { Container, AppBar, Toolbar, Button } from '@mui/material'


const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)    

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/flats">
            explore
          </Button>
          <Button color="inherit" component={Link} to="/trends">
            trends
          </Button>
          <Button color="inherit" component={Link} to="/">
            contact
          </Button>                         
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/flats/:id" element={<FlatDetailed />} />
        <Route path="/flats" element={<Flats errorMessage={errorMessage} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      
      <Footer />
    </Container>
  )
}

export default App
