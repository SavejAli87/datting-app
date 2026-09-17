import React, { useState } from 'react'
import { filterUsers } from '../api/discover'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import PersonTile from '../components/PersonTile'
import ThreadDivider from '../components/ThreadDivider'

const emptyFilters = {
  search: '',
  minAge: '',
  maxAge: '',
  minHeight: '',
  maxHeight: '',
  bodyType: '',
  appearance: '',
  language: '',
  englishLevel: '',
  ethnicity: '',
  lookingFor: '',
  gender: '',
  smoke: '',
  drink: '',
  maxDistanceKm: '',
  worldwide: false,
  onlyOnline: false,
}

const toList = (value) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

// User entity -> flat shape PersonTile expects
function toPerson(u) {
  const p = u.profile || {}
  return {
    id: u.id,
    name: p.displayName || p.name || u.name,
    age: p.age,
    currentCity: p.currentCity,
    profileImageUrl: p.profileImageUrl,
    online: p.online,
  }
}

export default function Browse() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const update = (key) => (e) =>
    setFilters((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const runSearch = async (targetPage = 0) => {
    setLoading(true)
    setSearched(true)
    try {
      const body = {
        userId: user.id,
        search: filters.search || undefined,
        minAge: filters.minAge ? Number(filters.minAge) : undefined,
        maxAge: filters.maxAge ? Number(filters.maxAge) : undefined,
        minHeight: filters.minHeight ? Number(filters.minHeight) : undefined,
        maxHeight: filters.maxHeight ? Number(filters.maxHeight) : undefined,
        bodyType: filters.bodyType ? toList(filters.bodyType) : undefined,
        appearance: filters.appearance ? toList(filters.appearance) : undefined,
        language: filters.language ? toList(filters.language) : undefined,
        englishLevel: filters.englishLevel ? toList(filters.englishLevel) : undefined,
        ethnicity: filters.ethnicity ? toList(filters.ethnicity) : undefined,
        lookingFor: filters.lookingFor ? toList(filters.lookingFor) : undefined,
        gender: filters.gender ? toList(filters.gender) : undefined,
        smoke: filters.smoke === '' ? undefined : filters.smoke === 'true',
        drink: filters.drink === '' ? undefined : filters.drink === 'true',
        maxDistanceKm: filters.maxDistanceKm ? Number(filters.maxDistanceKm) : undefined,
        worldwide: filters.worldwide,
        onlyOnline: filters.onlyOnline,
        page: targetPage,
        size: 12,
      }
      const data = await filterUsers(body)
      setPageData(data)
      setPage(targetPage)
    } catch {
      showToast('Search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    runSearch(0)
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Get specific</p>
        <h1 className="font-display text-3xl text-ink">Browse with filters</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <form onSubmit={submit} className="card mb-8 space-y-4 p-6">
        <input
          placeholder="Search by name"
          value={filters.search}
          onChange={update('search')}
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <input type="number" placeholder="Min age" value={filters.minAge} onChange={update('minAge')} className="input-field" />
          <input type="number" placeholder="Max age" value={filters.maxAge} onChange={update('maxAge')} className="input-field" />
          <input type="number" placeholder="Min height" value={filters.minHeight} onChange={update('minHeight')} className="input-field" />
          <input type="number" placeholder="Max height" value={filters.maxHeight} onChange={update('maxHeight')} className="input-field" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input placeholder="Gender (comma separated)" value={filters.gender} onChange={update('gender')} className="input-field" />
          <input placeholder="Language(s)" value={filters.language} onChange={update('language')} className="input-field" />
          <input placeholder="Ethnicity(ies)" value={filters.ethnicity} onChange={update('ethnicity')} className="input-field" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input placeholder="Body type(s)" value={filters.bodyType} onChange={update('bodyType')} className="input-field" />
          <input placeholder="Appearance" value={filters.appearance} onChange={update('appearance')} className="input-field" />
          <input placeholder="Looking for" value={filters.lookingFor} onChange={update('lookingFor')} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select value={filters.smoke} onChange={update('smoke')} className="input-field">
            <option value="">Smoking — any</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <select value={filters.drink} onChange={update('drink')} className="input-field">
            <option value="">Drinking — any</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <input
            type="number"
            placeholder="Max distance (km)"
            value={filters.maxDistanceKm}
            onChange={update('maxDistanceKm')}
            className="input-field"
          />
          <div className="flex items-center gap-3 px-1">
            <label className="flex items-center gap-1.5 text-sm text-ink-soft">
              <input type="checkbox" checked={filters.worldwide} onChange={update('worldwide')} />
              Worldwide
            </label>
            <label className="flex items-center gap-1.5 text-sm text-ink-soft">
              <input type="checkbox" checked={filters.onlyOnline} onChange={update('onlyOnline')} />
              Online only
            </label>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Apply filters
        </button>
      </form>

      {loading && <Loader label="Filtering" />}

      {!loading && searched && pageData && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {(pageData.content || []).length === 0 && (
              <p className="col-span-full text-center text-ink-faint">No one matched those filters.</p>
            )}
            {(pageData.content || []).map((u) => (
              <PersonTile key={u.id} person={toPerson(u)} />
            ))}
          </div>

          {pageData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => runSearch(page - 1)}
                disabled={page <= 0}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-ink-faint">
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                onClick={() => runSearch(page + 1)}
                disabled={page + 1 >= pageData.totalPages}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
