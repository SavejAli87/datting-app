import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/discover', label: 'Discover', icon: '◈' },
  { to: '/browse', label: 'Browse', icon: '⌕' },
  { to: '/connections', label: 'Connections', icon: '⟢' },
  { to: '/notifications', label: 'Notifications', icon: '♢' },
  { to: '/profile', label: 'Profile', icon: '☉' },
]

const SECONDARY_NAV_ITEMS = [
  { to: '/search', label: 'Quick search', icon: '✳' },
  { to: '/nearby', label: 'Nearby', icon: '⟡' },
]

export default function AppShell() {
  const { logout, user } = useAuth()

  return (
    <div className="min-h-screen bg-cream font-body md:flex">
      {/* Desktop left rail */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-ink/10 bg-white/60 px-5 py-8 md:flex">
        <div>
          <div className="mb-10 flex items-center gap-2">
            <span className="font-display text-2xl italic text-ink">Amara</span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-ink text-cream'
                      : 'text-ink-soft hover:bg-ink/5'
                  }`
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-ink/10" />
            {SECONDARY_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-ink/5'
                  }`
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                `mt-2 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-gold text-ink' : 'text-gold-dark hover:bg-gold/10'
                }`
              }
            >
              <span aria-hidden="true">✦</span>
              Go Premium
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-ink/5'
                }`
              }
            >
              <span aria-hidden="true">⚙</span>
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="border-t border-ink/10 pt-4">
          <p className="truncate text-sm font-semibold text-ink">{user?.username || 'You'}</p>
          <button
            onClick={logout}
            className="mt-2 text-sm text-ink-faint underline underline-offset-2 hover:text-ember"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-0">
        <div className="flex justify-end gap-4 px-4 pt-4 text-xs font-medium text-ink-faint md:hidden">
          {SECONDARY_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className="hover:text-ember">
              {item.icon} {item.label}
            </NavLink>
          ))}
          <NavLink to="/settings" className="hover:text-ember">
            ⚙ Settings
          </NavLink>
        </div>
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-white/95 backdrop-blur md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive ? 'text-ember' : 'text-ink-faint'
              }`
            }
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
