import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initRegister, verifyRegisterOtp } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import ThreadDivider from '../components/ThreadDivider'

export default function Register() {
  const [step, setStep] = useState('details') // 'details' | 'otp'
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: 'FEMALE',
  })
  const [sessionId, setSessionId] = useState(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithResponse } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submitDetails = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await initRegister(form)
      const sid = res.sessionId || res.session_id || res.sessionID
      if (!sid) throw new Error(res.message || 'Could not start registration')
      setSessionId(sid)
      setStep('otp')
      showToast('OTP sent to your mobile', 'success')
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await verifyRegisterOtp(sessionId, otp)
      loginWithResponse(data)
      showToast('Welcome to Amara!', 'success')
      navigate('/onboarding', { replace: true })
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Invalid OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3 text-gold">
            {step === 'details' ? 'Start your story' : 'Almost there'}
          </p>
          <h1 className="font-display text-4xl italic text-cream">Amara</h1>
          <ThreadDivider className="mx-auto mt-4 w-40" />
        </div>

        {step === 'details' ? (
          <form onSubmit={submitDetails} className="card space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Name</label>
              <input required value={form.name} onChange={update('name')} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Mobile number</label>
              <input
                type="tel"
                required
                value={form.mobile}
                onChange={update('mobile')}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Gender</label>
              <select value={form.gender} onChange={update('gender')} className="input-field">
                <option value="FEMALE">Woman</option>
                <option value="MALE">Man</option>
                <option value="OTHER">Non-binary / other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={update('password')}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Confirm password</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending OTP…' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="card space-y-4 p-6">
            <p className="text-sm text-ink-soft">
              Enter the OTP sent to <strong>{form.mobile}</strong>.
            </p>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field text-center tracking-[0.5em]"
              maxLength={6}
              placeholder="------"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying…' : 'Verify & create account'}
            </button>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-center text-sm text-ink-faint hover:text-ember"
            >
              Change details
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-cream/70">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
