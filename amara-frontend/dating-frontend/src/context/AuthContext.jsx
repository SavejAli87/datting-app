import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function isValidStoredUser(u) {
  // A valid session must have a numeric Long PK (`id`) separate from the
  // string user code (`userId`). Older/stale sessions saved before this
  // distinction existed may have `id` missing or equal to `userId` —
  // treat those as invalid so the person is asked to log in again rather
  // than silently sending the wrong id type to Long-typed endpoints.
  return !!u && u.id !== undefined && u.id !== null && String(u.id) !== String(u.userId)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('amara_user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!isValidStoredUser(parsed)) {
      localStorage.removeItem('amara_user')
      localStorage.removeItem('amara_token')
      return null
    }
    return parsed
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('amara_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('amara_user')
    }
  }, [user])

  // Response shape from AuthController: { token, userId, ID, gender, sessionId, username }
  const loginWithResponse = (data) => {
    if (data.ID === undefined || data.ID === null) {
      throw new Error('Login response is missing the numeric user id (ID) — check the backend response.')
    }
    localStorage.setItem('amara_token', data.token)
    const nextUser = {
      userId: data.userId,
      id: data.ID,
      gender: data.gender,
      sessionId: data.sessionId,
      username: data.username,
    }
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    localStorage.removeItem('amara_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginWithResponse, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
