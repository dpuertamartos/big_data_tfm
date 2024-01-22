import { useState, useEffect } from 'react'
import flatService from '../services/flats'
import trendService from '../services/trends'
import SelectFilter from './SelectFilter'
import LineGraph from './LineGraph'
import Listing from './Listing'
import provinces from '../../provinces.json'



const Home = () => {
  const [bestFlats, setBestFlats] = useState({})
  const [selectedprovinces, setSelectedprovinces] = useState(["all"])
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
    const newSelectedprovinces = event.target.value
    setSelectedprovinces(newSelectedprovinces)
  
    let updatedFlats = { ...bestFlats }
  
    // Fetch new flats for newly selected provinces
    for (const province of newSelectedprovinces) {
      if (!bestFlats[province]) {
        try {
          const params = {
              province: province !== 'all' ? province : undefined,
              orderBy: 'rating DESC', 
              limitNumber: 10
          }
          const flats = await flatService.getFiltered(params)
          updatedFlats[province] = flats
        } catch (error) {
          console.error(`Error fetching flats for ${province}:`, error)
        }
      }
    }
  
    // Remove flats for unselected provinces
    for (const province in bestFlats) {
      if (!newSelectedprovinces.includes(province)) {
        delete updatedFlats[province]
      }
    }
  
    setBestFlats(updatedFlats)
  }
  

  return (
    <span>
      <SelectFilter selectedElements={selectedprovinces} handleChange={handleChange} elementToChoose={provinces.locations} label="provinces"/>
      <LineGraph selectedprovinces={selectedprovinces} data={trendData} activeDotSelector={'all'} yAxisOptions={["price_euro_mean_excluding_outliers","count","price_per_m2","price_per_hab"]} yAxisDefault={"price_euro_mean_excluding_outliers"}/>
      <Listing data={bestFlats} />
    </span>
  )
}

export default Home;






