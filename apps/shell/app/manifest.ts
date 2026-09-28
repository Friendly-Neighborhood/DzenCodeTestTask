import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orders Hub',
    short_name: 'OrdersHub',
    description: 'Orders and Products operations console',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f7f9',
    theme_color: '#1f3038',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  }
}
