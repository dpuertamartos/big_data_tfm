import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useMatch
} from "react-router-dom"

import Home from './components/Home'
import Flat from './components/Flat'
import Flats from './components/Flats'
import Footer from './components/Footer'


import { Container, AppBar, Toolbar, Button } from '@mui/material'


const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)    

  const match = useMatch('/flats/:id')

  const flat = match
    ? flats.find(note => note.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/flats">
            flats
          </Button>
          <Button color="inherit" component={Link} to="/explore">
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
        <Route path="/flats/:id" element={<Flat flat={flat} />} />
        <Route path="/flats" element={<Flats errorMessage={errorMessage} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      
      <Footer />
    </Container>
  )
}

export default App
