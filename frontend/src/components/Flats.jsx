import { useState } from 'react'
import Notification from './Notification'
import Flat from './Flat'

const Flats= ({ flats, errorMessage }) => {
    const [showAll, setShowAll] = useState(true)
  
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