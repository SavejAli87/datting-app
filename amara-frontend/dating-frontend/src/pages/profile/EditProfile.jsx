import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMyProfile,
  updateBasic,
  updateDetails,
  updatePreferences,
} from '../../api/profile'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import Loader from '../../components/Loader'
import ThreadDivider from '../../components/ThreadDivider'

export default function EditProfile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [basic, setBasic] = useState({ name: '', displayName: '', bio: '', age: '' })
  const [details, setDetails] = useState({ language: '', bodyType: '', appearance: '', height: '' })
  const [prefs, setPrefs] = useState({ lookingFor: '', smoke: 'NO', drink: 'NO' })

  useEffect(() => {
    getMyProfile(user.id)
      .then((p) => {
        setBasic({ name: p.name || '', displayName: p.displayName || '', bio: p.bio || '', age: p.age || '' })
        setDetails({
          language: p.language || '',
          bodyType: p.bodyType || '',
          appearance: p.appearance || '',
          height: p.height || '',
        })
        setPrefs({
          lookingFor: p.lookingFor || '',
          smoke: p.smoke || 'NO',
          drink: p.drink || 'NO',
        })
      })
      .catch(() => showToast('Could not load profile', 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveAll = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all([
        updateBasic({ userId: user.id, ...basic, age: basic.age ? Number(basic.age) : null }),
        updateDetails({ userId: user.id, ...details, height: details.height ? Number(details.height) : null }),
        updatePreferences({ userId: user.id, ...prefs }),
      ])
      showToast('Profile updated', 'success')
      navigate('/profile')
    } catch {
      showToast('Could not save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading profile" />

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Keep it current</p>
        <h1 className="font-display text-3xl text-ink">Edit your profile</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      <form onSubmit={saveAll} className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Full name</label>
              <input
                value={basic.name}
                onChange={(e) => setBasic((b) => ({ ...b, name: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Display name</label>
              <input
                value={basic.displayName}
                onChange={(e) => setBasic((b) => ({ ...b, displayName: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Age</label>
              <input
                type="number"
                value={basic.age}
                onChange={(e) => setBasic((b) => ({ ...b, age: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-ink-soft">Bio</label>
            <textarea
              rows={3}
              value={basic.bio}
              onChange={(e) => setBasic((b) => ({ ...b, bio: e.target.value }))}
              className="input-field"
            />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Language</label>
              <input
                value={details.language}
                onChange={(e) => setDetails((d) => ({ ...d, language: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Body type</label>
              <input
                value={details.bodyType}
                onChange={(e) => setDetails((d) => ({ ...d, bodyType: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Appearance</label>
              <input
                value={details.appearance}
                onChange={(e) => setDetails((d) => ({ ...d, appearance: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Height (cm)</label>
              <input
                type="number"
                value={details.height}
                onChange={(e) => setDetails((d) => ({ ...d, height: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Preferences</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-ink-soft">Looking for</label>
              <input
                value={prefs.lookingFor}
                onChange={(e) => setPrefs((p) => ({ ...p, lookingFor: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Smoking</label>
              <select
                value={prefs.smoke}
                onChange={(e) => setPrefs((p) => ({ ...p, smoke: e.target.value }))}
                className="input-field"
              >
                <option value="NO">No</option>
                <option value="SOMETIMES">Sometimes</option>
                <option value="YES">Yes</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-soft">Drinking</label>
              <select
                value={prefs.drink}
                onChange={(e) => setPrefs((p) => ({ ...p, drink: e.target.value }))}
                className="input-field"
              >
                <option value="NO">No</option>
                <option value="SOMETIMES">Sometimes</option>
                <option value="YES">Yes</option>
              </select>
            </div>
          </div>
        </section>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
