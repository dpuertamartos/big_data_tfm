import axios from 'axios'
const baseUrl = '/api/flats'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getBest = (params = {}) => {
  const request = axios.get(`${baseUrl}/rating`, { params })
  return request.then(response => response.data)
}

const get = (id) => {
  const request = axios.get(`${baseUrl}/unique/${id}`);
  return request.then(response => response.data);
}

const getFiltered = (params = {}) => {
  return axios.get(`${baseUrl}/filtered`, { params }).then(response => response.data)
};

export default { getAll, getBest, get, getFiltered }