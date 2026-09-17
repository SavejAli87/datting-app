import React, { useState } from 'react'
import { reportUser } from '../api/account'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const REASONS = ['Fake profile', 'Inappropriate photos', 'Harassment', 'Spam', 'Other']

export default function ReportModal({ targetUserId, targetName, onClose }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [reason, setReason] = useState(REASONS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await reportUser(user.id, targetUserId, reason, message)
      showToast('Report submitted — thank you', 'success')
      onClose()
    } catch {
      showToast('Could not submit report', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4">
      <div className="card w-full max-w-sm p-6">
        <h3 className="font-display text-xl text-ink">
          Report {targetName || 'this profile'}
        </h3>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="input-field">
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft">
              Details <span className="text-ink-faint">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
