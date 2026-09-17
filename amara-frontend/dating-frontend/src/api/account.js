import client from './client'

// AccountController
export const deactivateAccount = (userId) =>
  client.post('/account/deactivate', null, { params: { userId } }).then((r) => r.data)

export const deleteAccount = (userId) =>
  client.delete('/account/delete', { params: { userId } }).then((r) => r.data)

export const activateAccount = (userId) =>
  client.put('/account/activate', null, { params: { userId } }).then((r) => r.data)

// SubscriptionController
export const activatePlan = (userId, plan) =>
  client.post('/subscriber/activate', null, { params: { userId, plan } }).then((r) => r.data)

export const getSubscriptionStatus = (userId) =>
  client.get('/subscriber/status', { params: { userId } }).then((r) => r.data)

export const getRemainingDays = (userId) =>
  client.get('/subscriber/remaining-days', { params: { userId } }).then((r) => r.data)

// RazorpayController
export const createRazorpayOrder = (userId, plan) =>
  client.post('/razorpay/create-order', null, { params: { userId, plan } }).then((r) => r.data)

export const verifyRazorpayPayment = (orderId, paymentId, signature) =>
  client
    .post('/razorpay/verify', null, { params: { orderId, paymentId, signature } })
    .then((r) => r.data)

// SupportController
export const createSupportTicket = (userId, subject, message) =>
  client.post('/support/create', { userId, subject, message }).then((r) => r.data)

export const getMyTickets = (userId) =>
  client.get('/support/my', { params: { userId } }).then((r) => r.data)

export const getTicketsByStatus = (status) =>
  client.get('/support/status', { params: { status } }).then((r) => r.data)

export const closeTicket = (ticketId) =>
  client.put(`/support/close/${ticketId}`).then((r) => r.data)

// ReportController
export const reportUser = (byUserId, targetUserId, reason, message) =>
  client.post('/reports/report', { byUserId, targetUserId, reason, message }).then((r) => r.data)

export const getReportsAgainstUser = (userId) =>
  client.get('/reports/against', { params: { userId } }).then((r) => r.data)

export const getMyReports = (userId) =>
  client.get('/reports/my', { params: { userId } }).then((r) => r.data)

// TelegramController
export const connectTelegram = (userId, username) =>
  client.post('/telegram/connect', null, { params: { userId, username } }).then((r) => r.data)

export const getTelegramLink = (userId) =>
  client.get('/telegram/link', { params: { userId } }).then((r) => r.data)

export const disconnectTelegram = (userId) =>
  client.delete('/telegram/disconnect', { params: { userId } }).then((r) => r.data)

// PrivacyController
export const acceptTerms = (userId) =>
  client.post('/privacy/accept', null, { params: { userId } }).then((r) => r.data)

export const getTermsStatus = (userId) =>
  client.get('/privacy/status', { params: { userId } }).then((r) => r.data)

export const getTermsDetails = (userId) =>
  client.get('/privacy/details', { params: { userId } }).then((r) => r.data)
