import { useState, useEffect } from 'react'
import Notification from './Notification'
import Flat from './Flat'
import flatService from '../services/flats'

const Flats= ({ errorMessage }) => {
    const [showAll, setShowAll] = useState(true)
    const [flats, setFlats] = useState([])

    useEffect(() => {
      const fetchFlats = async () => {
        try {
          const initialFlats = await flatService.getAll()
          setFlats({ all: initialFlats })
        } catch (error) {
          console.error("Error fetching initial flats:", error)
        }
      }
      fetchFlats()
    }, [])

    const flatsToShow = showAll
    ? flats
    : flats.filter(flat => flat.important)
    
    return (
    <div>
      <h2>flats</h2>
      <Notification message={errorMessage} /> 
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        {flatsToShow.map(flat => <Flat key={flat.id} flat={flat} />)}
      </ul>
    </div>
    )
}

export default Flats;