import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordSendOtp, resetPassword } from '../api/auth'
import { useToast } from '../components/Toast'
import ThreadDivider from '../components/ThreadDivider'

export default function ForgotPassword() {
  const [step, setStep] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const sendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPasswordSendOtp(mobile)
      setStep('reset')
      showToast('OTP sent', 'success')
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Could not send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const submitReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(mobile, otp, newPassword)
      showToast('Password reset. Please sign in.', 'success')
      navigate('/login', { replace: true })
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Reset failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3 text-gold">Reset password</p>
          <h1 className="font-display text-4xl italic text-cream">Amara</h1>
          <ThreadDivider className="mx-auto mt-4 w-40" />
        </div>

        {step === 'mobile' ? (
          <form onSubmit={sendOtp} className="card space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Mobile number</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitReset} className="card space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">OTP</label>
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center tracking-[0.5em]"
                maxLength={6}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">New password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-cream/70">
          <Link to="/login" className="font-semibold text-gold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
