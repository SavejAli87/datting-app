import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setupProfile } from '../api/profile'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import ThreadDivider from '../components/ThreadDivider'

const STEPS = ['Basics', 'About you', 'Preferences', 'Photo']

const emptyForm = {
  displayName: '',
  orientation: 'STRAIGHT',
  age: '',
  bio: '',
  dob: '',
  language: '',
  appearance: '',
  bodyType: '',
  height: '',
  englishLevel: '',
  ethnicity: '',
  lookingFor: '',
  smoke: 'NO',
  drink: 'NO',
}

export default function Onboarding() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

  const finish = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await setupProfile(
        user.id,
        { ...form, gender: user.gender },
        photo
      )
      showToast('Profile complete — let’s find your thread', 'success')
      navigate('/discover', { replace: true })
    } catch (err) {
      showToast(err?.response?.data?.message || err.message || 'Could not save profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <p className="eyebrow mb-2 text-gold">Step {stepIndex + 1} of {STEPS.length}</p>
          <h1 className="font-display text-3xl text-cream">{STEPS[stepIndex]}</h1>
          <ThreadDivider className="mx-auto mt-4 w-40" />
        </div>

        <div className="card p-6">
          {stepIndex === 0 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-soft">Display name</label>
                <input value={form.displayName} onChange={update('displayName')} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Age</label>
                  <input type="number" value={form.age} onChange={update('age')} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Date of birth</label>
                  <input type="date" value={form.dob} onChange={update('dob')} className="input-field" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-soft">Orientation</label>
                <select value={form.orientation} onChange={update('orientation')} className="input-field">
                  <option value="STRAIGHT">Straight</option>
                  <option value="GAY">Gay</option>
                  <option value="BISEXUAL">Bisexual</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-soft">Bio</label>
                <textarea value={form.bio} onChange={update('bio')} rows={3} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Height (cm)</label>
                  <input type="number" value={form.height} onChange={update('height')} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Body type</label>
                  <input value={form.bodyType} onChange={update('bodyType')} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Appearance</label>
                  <input value={form.appearance} onChange={update('appearance')} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Ethnicity</label>
                  <input value={form.ethnicity} onChange={update('ethnicity')} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Language</label>
                  <input value={form.language} onChange={update('language')} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">English level</label>
                  <input value={form.englishLevel} onChange={update('englishLevel')} className="input-field" />
                </div>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-soft">Looking for</label>
                <input
                  value={form.lookingFor}
                  onChange={update('lookingFor')}
                  className="input-field"
                  placeholder="e.g. Long term relationship"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Smoking</label>
                  <select value={form.smoke} onChange={update('smoke')} className="input-field">
                    <option value="NO">No</option>
                    <option value="SOMETIMES">Sometimes</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Drinking</label>
                  <select value={form.drink} onChange={update('drink')} className="input-field">
                    <option value="NO">No</option>
                    <option value="SOMETIMES">Sometimes</option>
                    <option value="YES">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-ink/5">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-5xl text-ink/20">＋</span>
                )}
              </div>
              <label className="btn-secondary inline-block cursor-pointer">
                Choose photo
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <button onClick={back} className="btn-secondary">
                Back
              </button>
            ) : (
              <span />
            )}
            {stepIndex < STEPS.length - 1 ? (
              <button onClick={next} className="btn-primary">
                Next
              </button>
            ) : (
              <button onClick={finish} disabled={loading} className="btn-primary">
                {loading ? 'Saving…' : 'Finish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
