import { useState, useEffect } from 'react'
import Notification from './Notification'
import Listing from './Listing'
import flatService from '../services/flats'

const Flats= ({ errorMessage }) => {
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


    return (
    <div>
      <Notification message={errorMessage} /> 
      <Listing data={flats}/> 
    </div>
    )
}

export default Flats;