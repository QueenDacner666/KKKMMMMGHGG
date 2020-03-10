import axios, { AxiosResponse } from 'axios'

class RequestError extends Error {
  response: AxiosResponse
}

const instance = axios.create({
  baseURL: process.env.API_URL,
})

instance.interceptors.response.use((response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new RequestError(response.statusText)
  error.response = response
  throw error
})

instance.interceptors.response.use((response) => {
  return response.data
})

export default instance
