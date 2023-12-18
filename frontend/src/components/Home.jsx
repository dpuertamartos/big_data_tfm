import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="madrid" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="all" stroke="#82ca9d" />
            <Line type="monotone" dataKey="jaen" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    </div>  
    )
  }
  
  export default Home;





