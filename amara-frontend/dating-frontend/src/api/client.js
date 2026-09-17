import axios from 'axios'

// Base URL of the Spring Boot backend (server.port=9395 in application.properties)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9395'

const client = axios.create({
  baseURL: API_BASE_URL,
})

// Attach JWT to every request once the user is logged in
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('amara_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralized 401 handling — bounce back to login if the token has expired
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('amara_token')
      localStorage.removeItem('amara_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
