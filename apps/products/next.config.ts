import type { NextConfig } from 'next'

const config: NextConfig = {
  basePath: '/products',
  transpilePackages: ['@orders-hub/shared', '@orders-hub/ui']
}

export default config
