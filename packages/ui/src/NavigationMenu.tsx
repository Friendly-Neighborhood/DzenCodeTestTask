'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@orders-hub/shared'

const entries = [
  { href: '/', key: 'nav.dashboard' as const, glyph: '⌂' },
  { href: '/orders', key: 'nav.orders' as const, glyph: '▤' },
  { href: '/products', key: 'nav.products' as const, glyph: '◫' }
]

export const NavigationMenu = () => {
  const { t } = useI18n()
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  return (
    <nav className="nav-menu" aria-label="Main navigation">
      {entries.map((entry) => {
        const active = entry.href === '/' ? pathname === '/' : pathname.startsWith(entry.href)
        return (
          <a key={entry.href} href={entry.href} className={`nav-menu__link ${active ? 'nav-menu__link--active' : ''}`}>
            <span className="nav-menu__glyph" aria-hidden="true">{entry.glyph}</span>
            <span>{t(entry.key)}</span>
          </a>
        )
      })}
    </nav>
  )
}
