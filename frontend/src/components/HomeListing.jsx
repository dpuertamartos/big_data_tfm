import Flat from './Flat';

const HomeListing = ({ data }) => {
    return (
        <div>
            {Object.entries(data).map(([city, flats]) => (
                <div key={city}>
                    <h3>{city.charAt(0).toUpperCase() + city.slice(1)} Flats</h3> 
                    <ul>
                        {flats.map(flat => <Flat key={flat.id} flat={flat} />)}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default HomeListing;
