import axios from 'axios'

const axiosCarrota = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
})

export default axiosCarrota
