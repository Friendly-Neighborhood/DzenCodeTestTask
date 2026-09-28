'use client'

import { useEffect } from 'react'

export const PwaRegistrar = ({ basePath = '' }: { basePath?: string }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: basePath ? `${basePath}/` : '/' }).catch(() => undefined)
    }
  }, [basePath])

  return null
}
