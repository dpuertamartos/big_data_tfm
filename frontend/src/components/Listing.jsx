import Flat from './Flat';

const Listing = ({ data, isCapital }) => {
    return (
        <div>
            {Object.entries(data).map(([province, flats]) => (
                <div key={`${province}-${isCapital}`}>
                    <ul>
                        {flats.map(flatData => <Flat key={flatData.id} flat={flatData} />)}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default Listing;
