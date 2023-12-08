import { useState, useEffect } from 'react'
import axios from 'axios'
import Flat from './components/Flat'


const App = () => {
  const [Flats, setFlats] = useState([])
  const [newFlat, setNewFlat] = useState('')
  const [showAll, setShowAll] = useState(true)


  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/flats')
      .then(response => {
        console.log('promise fulfilled')
        setFlats(response.data)
      })
  }, [])
  console.log('render', Flats.length, 'Flats')

  const addFlat = (event) => {
    event.preventDefault()
    const FlatObject = {
      name: newFlat,
      important: Math.random() > 0.5,
      id: Flats.length + 1,
    }
  
    setFlats(Flats.concat(FlatObject))
    setNewFlat('')
  }

  const handleFlatChange = (event) => {
    setNewFlat(event.target.value)
  }

  const FlatsToShow = showAll
    ? Flats
    : Flats.filter(Flat => Flat.important)

  return (
    <div>
      <h1>Flats</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {FlatsToShow.map(flat => 
          <Flat key={flat.id} flat={flat} />
        )}
      </ul>
      <form onSubmit={addFlat}>
      <input
          value={newFlat}
          onChange={handleFlatChange}
        />
        <button type="submit">save</button>
      </form> 
    </div>
  )
}

export default App
