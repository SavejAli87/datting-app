import client from './client'

// AuthController — /register, /verify-register/otp, /login
export const initRegister = (data) =>
  client.post('/register', data).then((r) => r.data)

export const verifyRegisterOtp = (sessionId, otp) =>
  client.post('/verify-register/otp', { sessionId, otp }).then((r) => r.data)

export const login = (mobile, password) =>
  client.post('/login', { mobile, password }).then((r) => r.data)

// MsgOtpController — /auth/send-otp, /auth/verify-otp (generic mobile OTP, e.g. for re-verification)
export const sendMobileOtp = (mobile) =>
  client.post('/auth/send-otp', { mobile }).then((r) => r.data)

export const verifyMobileOtp = (mobile, otp) =>
  client.post('/auth/verify-otp', { mobile, otp }).then((r) => r.data)

// ForgotPasswordController — /forgot-password/send-otp, /forgot-password/reset
export const forgotPasswordSendOtp = (mobile) =>
  client.post('/forgot-password/send-otp', { mobile }).then((r) => r.data)

export const resetPassword = (mobile, otp, newPassword) =>
  client.post('/forgot-password/reset', { mobile, otp, newPassword }).then((r) => r.data)

// ChangePasswordController — /setting/change-password
export const changePassword = (userId, oldPassword, newPassword) =>
  client
    .post('/setting/change-password', null, { params: { userId, oldPassword, newPassword } })
    .then((r) => r.data)
