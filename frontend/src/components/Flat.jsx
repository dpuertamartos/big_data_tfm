import { Link } from "react-router-dom"


const Flat = ({ flat }) => {

    return (
      <li>
        <Link to={`/flats/${flat.id}`}>{flat.title}</Link>,
        Price: {flat.price_euro}, Rating:{Math.floor(flat.rating*100)/100} 
      </li>
    )
  }
  
export default Flat