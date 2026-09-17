import React, { useEffect, useState } from 'react'
import { getHomeUsers, getOnlineUsers, getRecentUsers } from '../api/discover'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import UserCard from '../components/UserCard'
import PersonTile from '../components/PersonTile'
import ThreadDivider from '../components/ThreadDivider'

const TABS = [
  { key: 'foryou', label: 'For you' },
  { key: 'online', label: 'Online now' },
  { key: 'recent', label: 'Recently joined' },
]

// UserProfile -> flat shape PersonTile expects
function toPerson(p) {
  return {
    id: p.userDbId,
    name: p.displayName || p.name,
    age: p.age,
    currentCity: p.currentCity,
    profileImageUrl: p.profileImageUrl,
    online: p.online,
  }
}

export default function Discover() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('foryou')

  // "For you" deck state
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)
  const [deckLoading, setDeckLoading] = useState(true)

  // Online / Recent grid state
  const [gridItems, setGridItems] = useState([])
  const [gridLoading, setGridLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setDeckLoading(true)
    getHomeUsers(user.userId)
      .then((res) => mounted && setDeck(res.data || []))
      .catch(() => showToast('Could not load profiles', 'error'))
      .finally(() => mounted && setDeckLoading(false))
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userId])

  useEffect(() => {
    if (tab === 'foryou') return
    let mounted = true
    setGridLoading(true)
    const loader = tab === 'online' ? getOnlineUsers : getRecentUsers
    loader(0, 12)
      .then((page) => mounted && setGridItems((page?.content || []).map(toPerson)))
      .catch(() => showToast('Could not load list', 'error'))
      .finally(() => mounted && setGridLoading(false))
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const current = deck[index]
  const handleSkip = () => setIndex((i) => i + 1)
  const handleLike = () => {
    // HomeController's card payload doesn't include a user id, so a real
    // connection request can't be sent from this deck — nudge to Browse instead.
    showToast('Find them in Browse or Nearby to send a request', 'default')
    setIndex((i) => i + 1)
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Today's matches</p>
        <h1 className="font-display text-3xl text-ink">Find your thread</h1>
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

      {tab === 'foryou' &&
        (deckLoading ? (
          <Loader label="Finding people nearby" />
        ) : !current ? (
          <div className="card mx-auto max-w-sm p-10 text-center">
            <p className="font-display text-xl text-ink">You're all caught up</p>
            <p className="mt-2 text-sm text-ink-faint">
              Check back later, or try Browse to search with filters.
            </p>
          </div>
        ) : (
          <UserCard user={current} onLike={handleLike} onSkip={handleSkip} />
        ))}

      {tab !== 'foryou' &&
        (gridLoading ? (
          <Loader />
        ) : gridItems.length === 0 ? (
          <p className="text-center text-ink-faint">No one to show here yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {gridItems.map((p, i) => (
              <PersonTile key={p.id ?? i} person={p} />
            ))}
          </div>
        ))}
    </div>
  )
}
