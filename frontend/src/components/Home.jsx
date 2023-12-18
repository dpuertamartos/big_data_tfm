import { useState } from 'react';
import LineGraph from './LineGraph'
import HomeListing from './HomeListing'
import cities from '../../../cities.json';



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
];


const Home = () => {
  const [selectedCities, setSelectedCities] = useState(["all"]);
  
  const handleChange = (event) => {
    setSelectedCities(event.target.value);
  };

  return (
    <span>
        <LineGraph selectedCities={selectedCities} handleChange={handleChange} data={data} cities={cities} />
        <HomeListing />
    </span>
  );
};

export default Home;





