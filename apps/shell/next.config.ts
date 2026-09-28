import type { NextConfig } from 'next'

const ordersOrigin = process.env.ORDERS_ORIGIN ?? 'http://localhost:3001'
const productsOrigin = process.env.PRODUCTS_ORIGIN ?? 'http://localhost:3002'

const config: NextConfig = {
  transpilePackages: ['@orders-hub/shared', '@orders-hub/ui'],
  async rewrites() {
    return [
      { source: '/orders', destination: `${ordersOrigin}/orders` },
      { source: '/orders/:path*', destination: `${ordersOrigin}/orders/:path*` },
      { source: '/products', destination: `${productsOrigin}/products` },
      { source: '/products/:path*', destination: `${productsOrigin}/products/:path*` }
    ]
  }
}

export default config
