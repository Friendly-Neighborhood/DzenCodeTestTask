import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['packages/**/*.spec.ts', 'services/**/*.spec.ts'],
    environment: 'node'
  }
})
