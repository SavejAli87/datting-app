import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Matches Spring Boot backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Authentication
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const sendOtp = (data) => API.post('/msg-otp/send', data);
export const verifyOtp = (data) => API.post('/msg-otp/verify', data);
export const forgotPassword = (data) => API.post('/forgot-password/send-otp', data);
export const resetPassword = (data) => API.post('/forgot-password/reset', data);

// Profiles & Cards
export const getExploreCards = () => API.get('/profile/explore');
export const getMyProfile = () => API.get('/profile/me');
export const updateBasicProfile = (data) => API.put('/profile/basic', data);
export const updateDetailsProfile = (data) => API.put('/profile/details', data);
export const updatePreferences = (data) => API.put('/profile/preferences', data);
export const uploadProfileImage = (formData) => API.post('/user-images/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Connections & Swiping
export const sendConnectionRequest = (data) => API.post('/connections/send', data);
export const getReceivedRequests = () => API.get('/connections/received');
export const getMyConnections = () => API.get('/connections/matches');
export const respondConnection = (requestId, status) => API.put(`/connections/respond?id=${requestId}&status=${status}`);

// Filter & Search
export const searchUsers = (filterData) => API.post('/search/filter', filterData);
export const updateLocation = (data) => API.post('/location/update', data);

// Notifications & Support
export const getNotifications = () => API.get('/notifications');
export const submitSupportRequest = (data) => API.post('/support/create', data);
export const reportUser = (data) => API.post('/report/user', data);

// Razorpay & Subscriptions
export const createRazorpayOrder = (plan) => API.post(`/subscription/create-order?plan=${plan}`);
export const verifyPayment = (paymentData) => API.post('/subscription/verify-payment', paymentData);

export default API;
