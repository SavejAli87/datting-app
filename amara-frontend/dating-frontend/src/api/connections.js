import client from './client'

// ConnectionController
export const sendConnectionRequest = (senderId, receiverId) =>
  client.post('/connections/send', { senderId, receiverId }).then((r) => r.data)

export const acceptConnectionRequest = (requestId, userId) =>
  client.put('/connections/accept', { requestId, userId }).then((r) => r.data)

export const declineConnectionRequest = (requestId, userId) =>
  client.put('/connections/decline', { requestId, userId }).then((r) => r.data)

export const cancelConnectionRequest = (requestId, userId) =>
  client.put('/connections/cancel', { requestId, userId }).then((r) => r.data)

export const getReceivedRequests = (userId) =>
  client.get('/connections/received', { params: { userId } }).then((r) => r.data)

export const getSentRequests = (userId) =>
  client.get('/connections/sent', { params: { userId } }).then((r) => r.data)

export const getConnections = (userId) =>
  client.get('/connections/list', { params: { userId } }).then((r) => r.data)

export const getRelationshipStatus = (user1, user2) =>
  client.get('/connections/status', { params: { user1, user2 } }).then((r) => r.data)

// NotificationController
export const pushNotification = (userId, message) =>
  client.post('/notification/push', { userId: String(userId), message }).then((r) => r.data)

export const getNotifications = (userId) =>
  client.get('/notification', { params: { userId } }).then((r) => r.data)

export const markNotificationRead = (notificationId) =>
  client
    .put(`/notification/read/${notificationId}`, null, { params: { notificationId } })
    .then((r) => r.data)
