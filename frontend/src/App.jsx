import { useState, useEffect } from 'react'
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
import flatService from './services/flats'


const App = () => {
  const [flats, setFlats] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)    


  useEffect(() => {
    console.log('effect')
    flatService
      .getAll()
      .then(initialFlats => {
        setFlats(initialFlats)
      })
  }, [])
  

  const match = useMatch('/flats/:id')

  const flat = match
    ? flats.find(note => note.id === match.params.id)
    : null

  const padding = { padding: 5 } 

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/flats">flats</Link>
      </div>
      <Routes>
        <Route path="/flats/:id" element={<Flat flat={flat} />} />
        <Route path="/flats" element={<Flats flats={flats} errorMessage={errorMessage} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      
      <Footer />
    </div>
  )
}

export default App
