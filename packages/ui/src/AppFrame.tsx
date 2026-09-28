'use client'

import type { ReactNode } from 'react'
import { useI18n } from '@orders-hub/shared'
import { NavigationMenu } from './NavigationMenu'
import { TopMenu } from './TopMenu'

export const AppFrame = ({ children }: { children: ReactNode }) => {
  const { t } = useI18n()

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <a className="brand" href="/" aria-label="Orders Hub">
          <span className="brand__mark">O</span>
          <span className="brand__copy">
            <strong>Orders Hub</strong>
            <small>{t('brand.subtitle')}</small>
          </span>
        </a>
        <NavigationMenu />
        <div className="app-shell__sidebar-meta">
          <span>Middle+</span>
          <strong>Distributed UI</strong>
        </div>
      </aside>
      <section className="app-shell__workspace">
        <TopMenu />
        <main className="app-shell__content">{children}</main>
      </section>
    </div>
  )
}
