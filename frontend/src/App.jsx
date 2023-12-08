import { useState, useEffect } from 'react'
import axios from 'axios'
import Flat from './components/Flat'


const App = () => {
  const [flats, setFlats] = useState([])
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
  console.log('render', flats.length, 'Flats')

  const addFlat = (event) => {
    event.preventDefault()
    const flatObject = {
      id: flats.length + 1,
      price: Math.floor((Math.random() * 100)),
      name: newFlat,
      important: Math.random() > 0.5
    }
    
    axios
      .post("http://localhost:3001/flats", flatObject)
      .then(response =>{
        setFlats(flats.concat(flatObject))
        setNewFlat('')
      })
  }

  const handleFlatChange = (event) => {
    setNewFlat(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/flats/${id}`
    const flat = flats.find(n => n.id === id)
    const changedFlat = { ...flat, important: !flat.important }
  
    axios.put(url, changedFlat).then(response => {
      setFlats(flats.map(n => n.id !== id ? n : response.data))
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
