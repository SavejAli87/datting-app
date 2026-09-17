import React, { useCallback, useEffect, useState } from 'react'
import {
  acceptConnectionRequest,
  cancelConnectionRequest,
  declineConnectionRequest,
  getConnections,
  getReceivedRequests,
  getSentRequests,
} from '../api/connections'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import ThreadDivider from '../components/ThreadDivider'
import ReportModal from '../components/ReportModal'

const TABS = [
  { key: 'received', label: 'Requests' },
  { key: 'sent', label: 'Sent' },
  { key: 'matches', label: 'Connections' },
]

export default function Connections() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('received')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportTarget, setReportTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let data = []
      if (tab === 'received') data = await getReceivedRequests(user.id)
      if (tab === 'sent') data = await getSentRequests(user.id)
      if (tab === 'matches') data = await getConnections(user.id)
      setItems(data || [])
    } catch {
      showToast('Could not load connections', 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user.id])

  useEffect(() => {
    load()
  }, [load])

  const act = async (fn, requestId, successMsg) => {
    try {
      await fn(requestId, user.id)
      showToast(successMsg, 'success')
      load()
    } catch (err) {
      showToast(err?.response?.data?.message || 'Action failed', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Your people</p>
        <h1 className="font-display text-3xl text-ink">Connections</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? 'bg-ink text-cream' : 'bg-white text-ink-soft hover:bg-ink/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-center text-ink-faint">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((req) => (
            <div key={req.id} className="card flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-ink">
                  {tab === 'sent' ? `To user #${req.receiver?.id ?? req.receiverId}` : null}
                  {tab === 'received' ? `From user #${req.sender?.id ?? req.senderId}` : null}
                  {tab === 'matches'
                    ? `Connected with #${req.sender?.id === user.id ? req.receiver?.id : req.sender?.id}`
                    : null}
                </p>
                <p className="text-xs uppercase tracking-wide text-ink-faint">{req.status}</p>
              </div>
              <div className="flex gap-2">
                {tab === 'received' && (
                  <>
                    <button
                      onClick={() => act(acceptConnectionRequest, req.id, 'Connected!')}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => act(declineConnectionRequest, req.id, 'Declined')}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setReportTarget(req.sender?.id ?? req.senderId)}
                      aria-label="Report"
                      className="rounded-full border border-ink/10 px-2.5 text-xs text-ink-faint hover:border-ink/40"
                    >
                      ⚑
                    </button>
                  </>
                )}
                {tab === 'sent' && (
                  <button
                    onClick={() => act(cancelConnectionRequest, req.id, 'Request cancelled')}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reportTarget && (
        <ReportModal targetUserId={reportTarget} onClose={() => setReportTarget(null)} />
      )}
    </div>
  )
}
