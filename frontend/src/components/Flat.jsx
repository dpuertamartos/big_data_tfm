const Flat = ({ flat, toggleImportance }) => {
    const label = flat.important
      ? 'make not important' : 'make important'
    
    return (
      <li>
        {flat.title}, 
        Price: {flat.price_euro} 
        <button onClick={toggleImportance}>{label}  </button>
      </li>
    )
  }
  
export default Flat