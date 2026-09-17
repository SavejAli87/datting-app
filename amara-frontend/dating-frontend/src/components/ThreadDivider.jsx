import React from 'react'

// The app's signature motif: a thin gold thread connecting two points.
// Used sparingly — auth screens, discover header, connection accepted moments.
export default function ThreadDivider({ className = '' }) {
  return (
    <svg
      className={`thread-divider ${className}`}
      viewBox="0 0 240 24"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M4 18 C 70 -4, 170 -4, 236 18"
        stroke="#D9A441"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="4" cy="18" r="3" fill="#E8536B" />
      <circle cx="236" cy="18" r="3" fill="#E8536B" />
    </svg>
  )
}
