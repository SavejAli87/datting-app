import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import ThreadDivider from '../components/ThreadDivider'

export default function Login() {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithResponse } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(mobile, password)
      if (!data.success) throw new Error(data.message || 'Login failed')
      loginWithResponse(data)
      const redirectTo = location.state?.from?.pathname || '/discover'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Could not log in', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3 text-gold">Welcome back</p>
          <h1 className="font-display text-4xl italic text-cream">Amara</h1>
          <ThreadDivider className="mx-auto mt-4 w-40" />
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Mobile number</label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="input-field"
              placeholder="98765 43210"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-ember hover:underline">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-cream/70">
          New to Amara?{' '}
          <Link to="/register" className="font-semibold text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
