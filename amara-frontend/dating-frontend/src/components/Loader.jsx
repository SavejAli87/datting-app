import React from 'react'

export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-faint">
      <div className="h-8 w-8 rounded-full border-2 border-ink/10 border-t-ember animate-spin" />
      <p className="font-body text-sm">{label}…</p>
    </div>
  )
}
