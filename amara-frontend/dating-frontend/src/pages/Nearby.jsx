import React, { useEffect, useState } from 'react'
import {
  addLocation,
  getCurrentLocation,
  getLocationHistory,
  getNearbyUsers,
  switchLocation,
} from '../api/discover'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import PersonTile from '../components/PersonTile'
import ThreadDivider from '../components/ThreadDivider'

export default function Nearby() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [nearby, setNearby] = useState([])
  const [radius, setRadius] = useState(100)
  const [loading, setLoading] = useState(true)
  const [noLocationSet, setNoLocationSet] = useState(false)
  const [form, setForm] = useState({ city: '', state: '', country: '', lat: '', lng: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const loadLocation = async () => {
    const cur = await getCurrentLocation(user.id).catch(() => null)
    const hist = await getLocationHistory(user.id).catch(() => [])
    setCurrent(cur)
    setHistory(hist || [])
  }

  const loadNearby = async (r = radius) => {
    setLoading(true)
    try {
      const data = await getNearbyUsers(user.userId, r)
      setNearby(data || [])
      setNoLocationSet(false)
    } catch (err) {
      // Backend intentionally 400s with "Current location not found" when the
      // person hasn't added a location yet — that's not a real error, just show the prompt.
      const message = err?.response?.data?.message
      if (message && /location/i.test(message)) {
        setNoLocationSet(true)
      } else {
        showToast('Could not load nearby people', 'error')
      }
      setNearby([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocation()
    loadNearby()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useBrowserLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by this browser', 'error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
        }))
      },
      () => showToast('Could not get your location', 'error')
    )
  }

  const submitLocation = async (e) => {
    e.preventDefault()
    try {
      await addLocation({
        userId: user.id,
        city: form.city,
        state: form.state,
        country: form.country,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      })
      showToast('Location updated', 'success')
      setShowAddForm(false)
      setForm({ city: '', state: '', country: '', lat: '', lng: '' })
      loadLocation()
      loadNearby()
    } catch {
      showToast('Could not save location', 'error')
    }
  }

  const handleSwitch = async (locationId) => {
    try {
      await switchLocation(user.id, locationId)
      showToast('Switched location', 'success')
      loadLocation()
      loadNearby()
    } catch {
      showToast('Could not switch location', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Where you are</p>
        <h1 className="font-display text-3xl text-ink">Nearby</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <div className="card mb-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-faint">Current location</p>
            <p className="font-display text-lg text-ink">
              {current ? [current.city, current.state, current.country].filter(Boolean).join(', ') : 'Not set'}
            </p>
          </div>
          <button onClick={() => setShowAddForm((s) => !s)} className="btn-secondary px-4 py-2 text-sm">
            {showAddForm ? 'Cancel' : 'Update'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={submitLocation} className="mt-4 space-y-3 border-t border-ink/10 pt-4">
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="City" required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input-field" />
              <input placeholder="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="input-field" />
              <input placeholder="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="input-field" />
            </div>
            <div className="flex gap-3">
              <input placeholder="Latitude" value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))} className="input-field" />
              <input placeholder="Longitude" value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))} className="input-field" />
              <button type="button" onClick={useBrowserLocation} className="btn-secondary shrink-0 px-4 text-sm">
                Use my location
              </button>
            </div>
            <button type="submit" className="btn-primary">
              Save location
            </button>
          </form>
        )}

        {history.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
            {history.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSwitch(loc.id)}
                className="rounded-full bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-ink/10"
              >
                {loc.city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">People nearby</h2>
        <div className="flex items-center gap-2">
          <select
            value={radius}
            onChange={(e) => {
              setRadius(Number(e.target.value))
              loadNearby(Number(e.target.value))
            }}
            className="input-field w-auto py-1.5 text-sm"
          >
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
            <option value={250}>250 km</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : noLocationSet ? (
        <div className="card p-8 text-center">
          <p className="font-display text-lg text-ink">Add your location to see who's nearby</p>
          <p className="mt-1 text-sm text-ink-faint">Use the "Update" button above to set it.</p>
        </div>
      ) : nearby.length === 0 ? (
        <p className="text-center text-ink-faint">No one nearby yet — try a wider radius.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {nearby.map((p, i) => (
            <PersonTile key={i} person={{ name: p.name, currentCity: p.city, distance: p.distance }} />
          ))}
        </div>
      )}
    </div>
  )
}
