import { describe, expect, it } from 'vitest'
import { formatDateNumeric, sumPrices } from '../src/format'

describe('format utilities', () => {
  it('formats dates in the required compact form', () => {
    expect(formatDateNumeric('2017-06-29T12:09:33.000Z')).toMatch(/29\/06\/2017|29\/06\/2017/)
  })

  it('groups prices by currency', () => {
    expect(sumPrices([
      { value: 100, symbol: 'USD', isDefault: false },
      { value: 50, symbol: 'USD', isDefault: false },
      { value: 3900, symbol: 'UAH', isDefault: true }
    ])).toEqual({ USD: 150, UAH: 3900 })
  })
})
