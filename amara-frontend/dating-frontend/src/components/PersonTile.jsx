import React, { useState } from 'react'
import { resolveImageUrl } from '../utils/imageUrl'
import { sendConnectionRequest } from '../api/connections'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'
import ReportModal from './ReportModal'

// Renders one person from Browse / Nearby / Online / Recent results.
// Expects: { id, name, age, currentCity, profileImageUrl, online, distance }
export default function PersonTile({ person }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [sent, setSent] = useState(false)
  const [reporting, setReporting] = useState(false)
  const photo = resolveImageUrl(person.profileImageUrl)

  const connect = async () => {
    try {
      await sendConnectionRequest(user.id, person.id)
      setSent(true)
      showToast('Request sent', 'success')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not send request', 'error')
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-square bg-ink/5">
        {photo ? (
          <img src={photo} alt={person.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink/20">
            {person.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        {person.online && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-semibold text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Online
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-semibold text-ink">
          {person.name}
          {person.age ? `, ${person.age}` : ''}
        </p>
        <p className="truncate text-xs text-ink-faint">
          {person.distance !== undefined && person.distance !== null
            ? `${Number(person.distance).toFixed(1)} km away`
            : person.currentCity || ' '}
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={connect}
            disabled={sent || !person.id}
            className="flex-1 rounded-full bg-ember px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-ember-dark disabled:opacity-50"
          >
            {sent ? 'Sent' : 'Connect'}
          </button>
          {person.id && (
            <button
              onClick={() => setReporting(true)}
              aria-label="Report"
              className="rounded-full border border-ink/10 px-2.5 text-xs text-ink-faint hover:border-ink/40"
            >
              ⚑
            </button>
          )}
        </div>
      </div>

      {reporting && (
        <ReportModal
          targetUserId={person.id}
          targetName={person.name}
          onClose={() => setReporting(false)}
        />
      )}
    </div>
  )
}
