import { useState, useEffect } from 'react'
import flatService from '../services/flats'

import SelectFilter from './SelectFilter'
import LineGraph from './LineGraph'
import Listing from './Listing'
import cities from '../../../cities.json'



const data = [
  {
    name: '2023-08 prev',
    all: 4000,
    madrid: 2400,
    jaen: 2400,
  },
  {
    name: '2023-09',
    all: 3000,
    madrid: 1398,
    jaen: 2210,
  },
  {
    name: '2023-10',
    all: 2000,
    madrid: 9800,
    jaen: 2290,
  },
  {
    name: '2023-11',
    all: 2780,
    madrid: 3908,
    jaen: 2000,
  },
  {
    name: '2023-12',
    all: 1890,
    madrid: 4800,
    jaen: 2181,
  }
]


const Home = () => {
  const [bestFlats, setBestFlats] = useState({})
  const [selectedCities, setSelectedCities] = useState(["all"])

  useEffect(() => {
    const fetchBestFlats = async () => {
      try {
        const initialFlats = await flatService.getFiltered({
          orderBy: 'rating ASC',
          limitNumber: 10
        })
        setBestFlats({ all: initialFlats })
      } catch (error) {
        console.error("Error fetching initial flats:", error)
      }
    }
    fetchBestFlats()
  }, [])

  const handleChange = async (event) => {
    const newSelectedCities = event.target.value
    setSelectedCities(newSelectedCities)
  
    let updatedFlats = { ...bestFlats }
  
    // Fetch new flats for newly selected cities
    for (const city of newSelectedCities) {
      if (!bestFlats[city]) {
        try {
          const params = {
              city: city !== 'all' ? city : undefined,
              orderBy: 'rating ASC', 
              limitNumber: 10
          }
          const flats = await flatService.getFiltered(params)
          updatedFlats[city] = flats
        } catch (error) {
          console.error(`Error fetching flats for ${city}:`, error)
        }
      }
    }
  
    // Remove flats for unselected cities
    for (const city in bestFlats) {
      if (!newSelectedCities.includes(city)) {
        delete updatedFlats[city]
      }
    }
  
    setBestFlats(updatedFlats)
  }
  

  return (
    <span>
      <SelectFilter selectedElements={selectedCities} handleChange={handleChange} elementToChoose={cities.locations} />
      <LineGraph selectedCities={selectedCities} data={data} activeDotSelector={'all'} />
      <Listing data={bestFlats} />
    </span>
  )
}

export default Home;






