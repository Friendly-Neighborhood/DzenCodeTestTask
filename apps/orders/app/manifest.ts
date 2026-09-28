import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orders Hub · Orders',
    short_name: 'Orders',
    start_url: '/orders',
    display: 'standalone',
    background_color: '#f4f7f9',
    theme_color: '#1f3038'
  }
}
