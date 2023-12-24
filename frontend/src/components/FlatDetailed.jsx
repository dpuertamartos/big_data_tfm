import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import flatService from '../services/flats'

const Flat = () => {
  const { id } = useParams()
  const [flat, setFlat] = useState(null)

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const data = await flatService.get(id)
        setFlat(data)
      } catch (error) {
        console.error("Error fetching flat:", error)
      }
    }
    fetchFlat()
  }, [id])

  if (!flat) return <div>Loading...</div>

  return (
    <div>
      <h2>{flat.title}</h2>
      <div>Price: {flat.price_euro}</div>
      <div>Rating: {Math.floor(flat.rating * 100) / 100}</div>
    </div>
  )
}

export default Flat
