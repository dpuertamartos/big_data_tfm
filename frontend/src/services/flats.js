import axios from 'axios'
const baseUrl = '/api/flats'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getBestAll = () => {
  const request = axios.get(`${baseUrl}/best_rating`)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, getBestAll, create, update } 
