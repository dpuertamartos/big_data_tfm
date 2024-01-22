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
  const [selectedIsCapital, setSelectedIsCapital] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchInitialTrends = async () => {
      try {
        const initialTrends = await trendService.get({
          active: 'all',
          type: 'all',
          isCapital: selectedIsCapital
        });
        setTrendData(initialTrends);
      } catch (error) {
        console.error("Error fetching initial trends:", error);
      }
    };

    const fetchBestFlats = async () => {
      try {
        let updatedFlats = {}
        for (const province of selectedprovinces) {
          try {
            const params = {
                isCapital: selectedIsCapital !== 'all' ? selectedIsCapital: undefined,
                orderBy: 'rating DESC', 
                limitNumber: 10
            }
    
            if (province !== 'all') {
              params.province = province
            }
            const flats = await flatService.getFiltered(params)
            updatedFlats[province] = flats
          } catch (error) {
            console.error(`Error fetching flats for ${province}:`, error)
        }
        await setBestFlats({...updatedFlats})
      }} catch (error) {
        console.error("Error fetching initial flats:", error)
      } 
    }

    fetchInitialTrends()
    fetchBestFlats()
    setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Set loading to false
  }, [selectedIsCapital]);


  const handleChange = async (event, isCapitalChange = false) => {
    setIsLoading(true); // Set loading to true immediately
  
    if (isCapitalChange) {
      setSelectedIsCapital(event.target.value);
    } else {
      const newSelectedprovinces = event.target.value;
      setSelectedprovinces(newSelectedprovinces);
  
      let updatedFlats = { ...bestFlats };
  
      // Fetch new flats for newly selected provinces
      for (const province of newSelectedprovinces) {
        if (!bestFlats[province]) {
          try {
            const params = {
              province: province !== 'all' ? province : undefined,
              orderBy: 'rating DESC', 
              limitNumber: 10,
              isCapital: selectedIsCapital !== 'all' ? selectedIsCapital : undefined
            };
            const flats = await flatService.getFiltered(params);
            updatedFlats[province] = flats;
          } catch (error) {
            console.error(`Error fetching flats for ${province}:`, error);
          }
        }
      }
  
      // Remove flats for unselected provinces
      for (const province in bestFlats) {
        if (!newSelectedprovinces.includes(province)) {
          delete updatedFlats[province];
        }
      }
  
      setBestFlats(updatedFlats);
    }
  
    // Delay setting isLoading to false
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };  

  return (
    <span>
      <SelectFilter 
        selectedElements={selectedprovinces} 
        handleChange={(event) => handleChange(event, false)} 
        elementToChoose={provinces.locations} 
        label="provinces"
        disabled={isLoading}
        />
      <SelectFilter
        selectedElements={selectedIsCapital}
        handleChange={(event) => handleChange(event, true)}
        elementToChoose={["all","0","1"]}
        label="capital"
        multiple={false}
        disabled={isLoading}
        />
      <LineGraph selectedprovinces={selectedprovinces} data={trendData} activeDotSelector={'all'} yAxisOptions={["price_euro_mean_excluding_outliers","count","price_per_m2","price_per_hab"]} yAxisDefault={"price_euro_mean_excluding_outliers"}/>
      <Listing data={bestFlats} isCapital={selectedIsCapital} />
    </span>
  )
}

export default Home;






