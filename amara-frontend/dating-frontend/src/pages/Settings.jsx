import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { changePassword } from '../api/auth'
import {
  connectTelegram,
  deactivateAccount,
  deleteAccount,
  disconnectTelegram,
  getTelegramLink,
  getTermsStatus,
} from '../api/account'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import ThreadDivider from '../components/ThreadDivider'

export default function Settings() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [telegramLink, setTelegramLink] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getTelegramLink(user.id)
      .then(setTelegramLink)
      .catch(() => {})
    getTermsStatus(user.id)
      .then(setTermsAccepted)
      .catch(() => {})
  }, [user.id])

  const submitPasswordChange = async (e) => {
    e.preventDefault()
    try {
      await changePassword(user.id, oldPassword, newPassword)
      showToast('Password changed', 'success')
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not change password', 'error')
    }
  }

  const handleTelegramConnect = async (e) => {
    e.preventDefault()
    try {
      await connectTelegram(user.id, telegramUsername)
      showToast('Telegram connected', 'success')
      setTelegramLink(await getTelegramLink(user.id))
    } catch {
      showToast('Could not connect Telegram', 'error')
    }
  }

  const handleTelegramDisconnect = async () => {
    try {
      await disconnectTelegram(user.id)
      showToast('Telegram disconnected', 'success')
      setTelegramLink(null)
    } catch {
      showToast('Could not disconnect Telegram', 'error')
    }
  }

  const handleDeactivate = async () => {
    try {
      await deactivateAccount(user.id)
      showToast('Account deactivated', 'success')
      logout()
      navigate('/login', { replace: true })
    } catch {
      showToast('Could not deactivate account', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccount(user.id)
      showToast('Account deleted', 'success')
      logout()
      navigate('/login', { replace: true })
    } catch {
      showToast('Could not delete account', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Manage</p>
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Change password</h2>
          <form onSubmit={submitPasswordChange} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="New password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Update password
            </button>
          </form>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Telegram</h2>
          {telegramLink ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-soft break-all">{telegramLink}</p>
              <button onClick={handleTelegramDisconnect} className="btn-secondary px-4 py-2 text-sm">
                Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleTelegramConnect} className="flex gap-3">
              <input
                placeholder="@username"
                required
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn-primary px-5">
                Connect
              </button>
            </form>
          )}
        </section>

        <section className="card p-6">
          <h2 className="mb-2 font-display text-lg text-ink">Support & legal</h2>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/support" className="text-ember hover:underline">
              Contact support
            </Link>
            <p className="text-ink-faint">
              Terms accepted: {termsAccepted === null ? '—' : termsAccepted ? 'Yes' : 'No'}
            </p>
          </div>
        </section>

        <section className="card border border-ember/20 p-6">
          <h2 className="mb-4 font-display text-lg text-ember-dark">Danger zone</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDeactivate} className="btn-secondary">
              Deactivate account
            </button>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="btn-secondary border-ember/40 text-ember-dark">
                Delete account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ember-dark">Are you sure?</span>
                <button onClick={handleDelete} className="btn-primary bg-ember-dark px-4 py-2 text-sm hover:bg-ember-dark">
                  Yes, delete
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn-secondary px-4 py-2 text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
