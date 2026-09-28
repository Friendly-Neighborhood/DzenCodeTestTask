export type CurrencySymbol = 'USD' | 'UAH' | string

export interface Money {
  value: number
  symbol: CurrencySymbol
  isDefault: boolean
}

export interface OrderSummary {
  id: number
  title: string
}

export interface Product {
  id: number
  serialNumber: string
  isNew: boolean
  photo: string
  title: string
  type: string
  specification: string
  guarantee: {
    start: string
    end: string
  }
  price: Money[]
  order: OrderSummary
  date: string
}

export interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

export interface DomainEvent {
  type: string
  aggregateId: number | string
  at: string
}

export interface TotalsByCurrency {
  [symbol: string]: number
}
