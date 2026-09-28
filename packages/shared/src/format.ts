import type { Money, TotalsByCurrency } from './types'

const toDate = (value: string) => {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  return new Date(normalized)
}

export const formatDateNumeric = (value: string) => {
  const date = toDate(value)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export const formatDateLong = (value: string, locale = 'en-US') => {
  const date = toDate(value)
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export const formatDateTime = (value: Date, locale = 'en-US') => new Intl.DateTimeFormat(locale, {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).format(value)

export const formatMoney = (value: number, symbol: string) => {
  const currency = symbol === 'UAH' ? 'UAH' : symbol
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${symbol}`
  }
}

export const sumPrices = (prices: Money[]) => prices.reduce<TotalsByCurrency>((totals, price) => ({
  ...totals,
  [price.symbol]: (totals[price.symbol] ?? 0) + price.value
}), {})
