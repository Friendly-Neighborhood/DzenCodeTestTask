import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orders Hub · Products',
    short_name: 'Products',
    start_url: '/products',
    display: 'standalone',
    background_color: '#f4f7f9',
    theme_color: '#1f3038'
  }
}
