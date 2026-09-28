'use client'

import { useEffect, useState } from 'react'
import { formatDateTime, useActiveSessions, useI18n } from '@orders-hub/shared'

export const TopMenu = () => {
  const { locale, setLocale, t } = useI18n()
  const { count, connected } = useActiveSessions()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <header className="top-menu">
      <div className="top-menu__clock">
        <span className="top-menu__date">{formatDateTime(now, locale === 'ru' ? 'ru-RU' : 'en-US')}</span>
      </div>
      <div className="top-menu__actions">
        <div className="top-menu__sessions" title={connected ? t('top.connected') : t('top.disconnected')}>
          <span className={`top-menu__status ${connected ? 'top-menu__status--online' : 'top-menu__status--offline'}`} />
          <strong>{count}</strong>
          <span>{t('top.sessions')}</span>
        </div>
        <div className="top-menu__locale" aria-label={t('top.language')}>
          <button
            type="button"
            className={`top-menu__locale-button ${locale === 'en' ? 'top-menu__locale-button--active' : ''}`}
            onClick={() => setLocale('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`top-menu__locale-button ${locale === 'ru' ? 'top-menu__locale-button--active' : ''}`}
            onClick={() => setLocale('ru')}
          >
            RU
          </button>
        </div>
      </div>
    </header>
  )
}
