import { useState, useEffect } from 'react'
import flatService from '../services/flats'
import trendService from '../services/trends'
import SelectFilter from './SelectFilter'
import LineGraph from './LineGraph'
import Listing from './Listing'
import cities from '../../cities.json'



const Home = () => {
  const [bestFlats, setBestFlats] = useState({})
  const [selectedCities, setSelectedCities] = useState(["all"])
  const [trendData, setTrendData] = useState([])

  useEffect(() => {
    const fetchBestFlats = async () => {
      try {
        const initialFlats = await flatService.getFiltered({
          orderBy: 'rating DESC',
          limitNumber: 10
        })
        setBestFlats({ all: initialFlats })
      } catch (error) {
        console.error("Error fetching initial flats:", error)
      }
    }

    const fetchInitialTrends = async () => {
      try {
        const initialTrends = await trendService.get({
          active: 'all',
          type: 'all'
        })
        setTrendData(initialTrends);
      } catch (error) {
        console.error("Error fetching initial trends:", error);
      }
    }

    fetchBestFlats()
    fetchInitialTrends()
  }, [])

  console.log(trendData)
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
              orderBy: 'rating DESC', 
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
      <SelectFilter selectedElements={selectedCities} handleChange={handleChange} elementToChoose={cities.locations} label="provinces"/>
      <LineGraph selectedCities={selectedCities} data={trendData} activeDotSelector={'all'} yAxisOptions={["price_euro_mean_excluding_outliers","count","price_per_m2","price_per_hab"]} yAxisDefault={"price_euro_mean_excluding_outliers"}/>
      <Listing data={bestFlats} />
    </span>
  )
}

export default Home;






