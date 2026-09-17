import React, { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead } from '../api/connections'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import ThreadDivider from '../components/ThreadDivider'

export default function Notifications() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getNotifications(user.id)
      .then((data) => setItems(data || []))
      .catch(() => showToast('Could not load notifications', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch {
      showToast('Could not update notification', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Stay in the loop</p>
        <h1 className="font-display text-3xl text-ink">Notifications</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-center text-ink-faint">You're all caught up.</p>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.read && handleRead(n.id)}
              className={`card flex w-full items-start gap-3 p-4 text-left transition ${
                n.read ? 'opacity-60' : ''
              }`}
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.read ? 'bg-ink/20' : 'bg-ember'
                }`}
              />
              <div>
                <p className="text-sm text-ink">{n.message}</p>
                {n.createdAt && (
                  <p className="mt-1 text-xs text-ink-faint">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
