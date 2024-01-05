import axios from 'axios'
const baseUrl = '/api/trends'


const get = (params = {}) => {
  return axios.get(`${baseUrl}`, { params } ).then(response => response.data)
}

export default { get }