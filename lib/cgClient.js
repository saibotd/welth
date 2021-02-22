import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 4000,
})

export default client
