import React, { useState } from 'react'
import { searchUsers } from '../api/discover'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import { resolveImageUrl } from '../utils/imageUrl'
import ThreadDivider from '../components/ThreadDivider'

const emptyFilters = {
  name: '',
  gender: '',
  minAge: '',
  maxAge: '',
  language: '',
  ethnicity: '',
  smoke: '',
  drink: '',
  sortBy: '',
}

export default function Search() {
  const [filters, setFilters] = useState(emptyFilters)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  const runSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cleaned = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )
      const data = await searchUsers(cleaned)
      setResults(data)
    } catch (err) {
      showToast('Search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Refine</p>
        <h1 className="font-display text-3xl text-ink">Search for someone specific</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <form onSubmit={runSearch} className="card mb-8 grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
        <input
          placeholder="Name"
          value={filters.name}
          onChange={update('name')}
          className="input-field col-span-2 sm:col-span-1"
        />
        <select value={filters.gender} onChange={update('gender')} className="input-field">
          <option value="">Any gender</option>
          <option value="MALE">Man</option>
          <option value="FEMALE">Woman</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          type="number"
          placeholder="Min age"
          value={filters.minAge}
          onChange={update('minAge')}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Max age"
          value={filters.maxAge}
          onChange={update('maxAge')}
          className="input-field"
        />
        <input
          placeholder="Language"
          value={filters.language}
          onChange={update('language')}
          className="input-field"
        />
        <input
          placeholder="Ethnicity"
          value={filters.ethnicity}
          onChange={update('ethnicity')}
          className="input-field"
        />
        <select value={filters.smoke} onChange={update('smoke')} className="input-field">
          <option value="">Smoking — any</option>
          <option value="NO">No</option>
          <option value="SOMETIMES">Sometimes</option>
          <option value="YES">Yes</option>
        </select>
        <select value={filters.drink} onChange={update('drink')} className="input-field">
          <option value="">Drinking — any</option>
          <option value="NO">No</option>
          <option value="SOMETIMES">Sometimes</option>
          <option value="YES">Yes</option>
        </select>
        <button type="submit" className="btn-primary col-span-2 sm:col-span-1">
          Search
        </button>
      </form>

      {loading && <Loader label="Searching" />}

      {results && !loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {results.length === 0 && (
            <p className="col-span-full text-center text-ink-faint">No one matched those filters.</p>
          )}
          {results.map((u, i) => {
            const photo = resolveImageUrl(u.profileImageUrl)
            return (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-square bg-ink/5">
                  {photo ? (
                    <img src={photo} alt={u.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink/20">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-ink">
                    {u.name}, {u.age}
                  </p>
                  <p className="truncate text-xs text-ink-faint">{u.currentCity}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
