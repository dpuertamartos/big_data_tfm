const Flat = ({ flat, toggleImportance }) => {
    const label = flat.important
      ? 'make not important' : 'make important'
    
    return (
      <li>
        {flat.name}, 
        Price: {flat.price} 
        <button onClick={toggleImportance}>{label}  </button>
      </li>
    )
  }
  
export default Flat