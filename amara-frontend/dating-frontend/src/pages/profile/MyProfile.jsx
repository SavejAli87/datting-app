import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteGalleryImage,
  getGalleryImages,
  getMyProfile,
  getProfileCompletion,
  setProfilePhoto,
  uploadGalleryImage,
} from '../../api/profile'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import Loader from '../../components/Loader'
import ThreadDivider from '../../components/ThreadDivider'
import { resolveImageUrl } from '../../utils/imageUrl'

export default function MyProfile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [images, setImages] = useState([])
  const [completion, setCompletion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [p, imgs, comp] = await Promise.all([
        getMyProfile(user.id),
        getGalleryImages(String(user.userId)).catch(() => ({ data: [] })),
        getProfileCompletion(user.id).catch(() => null),
      ])
      setProfile(p)
      setImages(imgs?.data || [])
      setCompletion(comp)
    } catch {
      showToast('Could not load your profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadGalleryImage(String(user.userId), file)
      showToast('Photo added', 'success')
      load()
    } catch {
      showToast('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId) => {
    try {
      await deleteGalleryImage(imageId)
      showToast('Photo removed', 'success')
      load()
    } catch {
      showToast('Could not remove photo', 'error')
    }
  }

  const handleSetProfilePhoto = async (imageId) => {
    try {
      await setProfilePhoto(user.id, imageId)
      showToast('Profile photo updated', 'success')
      load()
    } catch {
      showToast('Could not set profile photo', 'error')
    }
  }

  if (loading) return <Loader label="Loading your profile" />
  if (!profile) return null

  const mainPhoto = resolveImageUrl(profile.profileImageUrl)

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="eyebrow mb-2">Your story</p>
        <h1 className="font-display text-3xl text-ink">{profile.displayName || profile.name}</h1>
        <ThreadDivider className="mx-auto mt-3 w-32" />
      </div>

      {completion !== null && (
        <div className="card mb-6 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-soft">Profile completion</span>
            <span className="font-semibold text-ember">{completion}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ember to-gold"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      )}

      <div className="card mb-6 flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-ink/5">
          {mainPhoto ? (
            <img src={mainPhoto} alt={profile.displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink/20">
              {(profile.displayName || profile.name)?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-ink-soft">{profile.bio || 'No bio yet — add one from Edit profile.'}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-ink-faint sm:justify-start">
            {profile.language && <span className="rounded-full bg-ink/5 px-3 py-1">{profile.language}</span>}
            {profile.bodyType && <span className="rounded-full bg-ink/5 px-3 py-1">{profile.bodyType}</span>}
            {profile.height && <span className="rounded-full bg-ink/5 px-3 py-1">{profile.height} cm</span>}
            {profile.ethnicity && <span className="rounded-full bg-ink/5 px-3 py-1">{profile.ethnicity}</span>}
            {profile.verifiedSelfie && (
              <span className="rounded-full bg-sage/10 px-3 py-1 text-sage">Verified</span>
            )}
          </div>
          <Link to="/profile/edit" className="btn-secondary mt-4 inline-block px-5 py-2 text-sm">
            Edit profile
          </Link>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Gallery</h2>
        <label className="btn-gold cursor-pointer px-4 py-2 text-sm">
          {uploading ? 'Uploading…' : 'Add photo'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.length === 0 && (
          <p className="col-span-full text-center text-sm text-ink-faint">No gallery photos yet.</p>
        )}
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl2 bg-ink/5">
            <img src={resolveImageUrl(img.imageUrl || img.url)} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/60 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => handleSetProfilePhoto(img.id)}
                className="rounded-full bg-cream px-2 py-1 text-[10px] font-semibold text-ink"
              >
                Set as main
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                className="rounded-full bg-ember px-2 py-1 text-[10px] font-semibold text-cream"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
