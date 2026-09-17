import React, { useEffect, useState } from 'react'
import { createSupportTicket, getMyTickets } from '../api/account'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import ThreadDivider from '../components/ThreadDivider'

export default function Support() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    getMyTickets(user.id)
      .then(setTickets)
      .catch(() => showToast('Could not load tickets', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createSupportTicket(user.id, subject, message)
      showToast('Ticket submitted', 'success')
      setSubject('')
      setMessage('')
      load()
    } catch {
      showToast('Could not submit ticket', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">We're here to help</p>
        <h1 className="font-display text-3xl text-ink">Support</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <form onSubmit={submit} className="card mb-8 space-y-3 p-6">
        <input
          placeholder="Subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Tell us what's going on"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field"
        />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Sending…' : 'Submit ticket'}
        </button>
      </form>

      <h2 className="mb-3 font-display text-xl text-ink">Your tickets</h2>
      {loading ? (
        <Loader />
      ) : tickets.length === 0 ? (
        <p className="text-center text-ink-faint">No tickets yet.</p>
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{t.subject}</p>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs uppercase text-ink-faint">
                  {t.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
