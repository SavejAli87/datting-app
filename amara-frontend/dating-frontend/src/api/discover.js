import client from './client'

// HomeController — the main discover/swipe deck
export const getHomeUsers = (userId) =>
  client.get(`/home/${userId}`).then((r) => r.data)

// SearchController — simple keyword+attribute search
export const searchUsers = (filters) =>
  client.post('/search', filters).then((r) => r.data)

// UserFilterController — advanced paginated filter
export const filterUsers = (filterRequest) =>
  client.post('/users/filter', filterRequest).then((r) => r.data)

// DashboardController — online / recently joined tabs
export const getOnlineUsers = (page = 0, size = 10) =>
  client.get('/dashboard/online', { params: { page, size } }).then((r) => r.data)

export const getRecentUsers = (page = 0, size = 10) =>
  client.get('/dashboard/recent', { params: { page, size } }).then((r) => r.data)

// LocationController
export const getCurrentLocation = (userId) =>
  client.get(`/location/current/${userId}`).then((r) => r.data)

export const getLocationHistory = (userId) =>
  client.get(`/location/history/${userId}`).then((r) => r.data)

export const addLocation = (dto) =>
  client.post('/location/add', dto).then((r) => r.data)

export const switchLocation = (userId, locationId) =>
  client.put('/location/switch', null, { params: { userId, locationId } }).then((r) => r.data)

export const getNearbyUsers = (userId, radius = 100) =>
  client.get('/location/nearby', { params: { userId, radius } }).then((r) => r.data)

// OnlineStatusController
export const setOnline = (userId) =>
  client.put('/status/online', null, { params: { userId } }).then((r) => r.data)

export const setOffline = (userId) =>
  client.put('/status/offline', null, { params: { userId } }).then((r) => r.data)
