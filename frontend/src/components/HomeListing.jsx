import Flat from './Flat'


const HomeListing = ({data}) => {
    return(
        <ul>
        {data.map(flat => <Flat key={flat.id} flat={flat} />)}
        </ul>
    )
}   

export default HomeListing;