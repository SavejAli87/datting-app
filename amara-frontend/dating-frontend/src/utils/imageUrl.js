import { API_BASE_URL } from '../api/client'

// Backend serves uploaded files from /amara/** (see StaticConfig.java).
// Profile/gallery image fields may come back as absolute URLs or relative paths —
// this normalizes either case to something the <img> tag can load.
export function resolveImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}
