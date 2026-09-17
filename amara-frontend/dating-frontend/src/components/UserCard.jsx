import React from 'react'
import { resolveImageUrl } from '../utils/imageUrl'

export default function UserCard({ user, onLike, onSkip }) {
  const photo = resolveImageUrl(user.profileImageUrl)

  return (
    <div className="card relative mx-auto flex h-[560px] w-full max-w-sm flex-col overflow-hidden">
      <div className="relative h-4/5 w-full bg-ink/5">
        {photo ? (
          <img src={photo} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-6xl text-ink/20">
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-5 pb-4 pt-10">
          <h3 className="font-display text-2xl text-cream">
            {user.name}
            {user.age ? <span className="ml-2 font-body text-lg text-cream/80">{user.age}</span> : null}
          </h3>
          {user.currentCity && <p className="text-sm text-cream/80">{user.currentCity}</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <p className="line-clamp-2 text-sm text-ink-soft">{user.bio || 'No bio yet.'}</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            onClick={onSkip}
            aria-label="Skip"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 text-2xl text-ink-faint transition hover:border-ink/40 hover:text-ink"
          >
            ✕
          </button>
          <button
            onClick={onLike}
            aria-label="Connect"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-2xl text-cream shadow-soft transition hover:bg-ember-dark"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  )
}
