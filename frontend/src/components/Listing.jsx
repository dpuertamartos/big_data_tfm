import Flat from './Flat'

const Listing = ({ data, isCapital }) => {
    return (
        <div>
            {Object.entries(data).map(([province, flats]) => (
                <div key={`${province}-${isCapital}`}>
                    <h3>{province.charAt(0).toUpperCase() + province.slice(1)} Flats {isCapital === "1" ? 'Capital' : isCapital === "0" ? 'Fuera de la Capital' : '' }</h3> 
                    <ul>
                        {flats.map(flat => <Flat key={flat.id} flat={flat} />)}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default Listing
