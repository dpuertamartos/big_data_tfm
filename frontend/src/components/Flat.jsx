import { Link } from "react-router-dom"


const Flat = ({ flat }) => {

    return (
      <li>
        <Link to={`/flats/${flat.id}`}>{flat.title}</Link>,
        Price: {flat.price_euro} 
      </li>
    )
  }
  
export default Flat