import { useState, useEffect } from 'react'
import Flat from './components/Flat'
import flatService from './services/flats'


const App = () => {
  const [flats, setFlats] = useState([])
  const [newFlat, setNewFlat] = useState('')
  const [showAll, setShowAll] = useState(true)


  useEffect(() => {
    console.log('effect')
    flatService
      .getAll()
      .then(initialFlats => {
        setFlats(initialFlats)
      })
  }, [])
  console.log('render', flats.length, 'Flats')

  const addFlat = (event) => {
    event.preventDefault()
    const flatObject = {
      id: flats.length + 1,
      price: Math.floor((Math.random() * 100)),
      name: newFlat,
      important: Math.random() > 0.5
    }
    
    flatService
      .create(flatObject)
      .then(returnedFlat =>{
        setFlats(flats.concat(returnedFlat))
        setNewFlat('')
      })
  }

  const handleFlatChange = (event) => {
    setNewFlat(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const flat = flats.find(n => n.id === id)
    const changedFlat = { ...flat, important: !flat.important }
  
    flatService
      .update(id, changedFlat)
      .then(returnedFlat => {
      setFlats(flats.map(n => n.id !== id ? n : returnedFlat))
    })
  }

  const flatsToShow = showAll
    ? flats
    : flats.filter(flat => flat.important)

  return (
    <div>
      <h1>Flats</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {flatsToShow.map(flat => 
          <Flat key={flat.id} flat={flat} toggleImportance={() => toggleImportanceOf(flat.id)} />
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
