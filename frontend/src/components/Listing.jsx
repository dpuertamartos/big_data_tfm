import Flat from './Flat'

const Listing = ({ data }) => {
    return (
        <div>
            {Object.entries(data).map(([province, flats]) => (
                <div key={province}>
                    <h3>{province.charAt(0).toUpperCase() + province.slice(1)} Flats</h3> 
                    <ul>
                        {flats.map(flat => <Flat key={flat.id} flat={flat} />)}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default Listing
