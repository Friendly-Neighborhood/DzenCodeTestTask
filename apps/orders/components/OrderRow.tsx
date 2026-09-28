'use client'

import { formatDateLong, formatDateNumeric, formatMoney, useI18n, type Order, type TotalsByCurrency } from '@orders-hub/shared'

interface Props {
  order: Order
  active: boolean
  totals: TotalsByCurrency
  onSelect: () => void
  onDelete: () => void
}

export const OrderRow = ({ order, active, totals, onSelect, onDelete }: Props) => {
  const { locale, t } = useI18n()
  return (
    <article
      className={`order-row ${active ? 'order-row--active' : ''}`}
      onClick={onSelect}
      data-testid="order-row"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onSelect()
        }
      }}
    >
      <div className="order-row__main">
        <span className="order-row__icon">▤</span>
        <div>
          <h3>{order.title}</h3>
          <p>{order.description}</p>
        </div>
      </div>
      <div className="order-row__count">
        <strong>{order.products.length}</strong>
        <span>{t('orders.products')}</span>
      </div>
      <div className="order-row__dates">
        <span>{formatDateNumeric(order.date)}</span>
        <strong>{formatDateLong(order.date, locale === 'ru' ? 'ru-RU' : 'en-US')}</strong>
      </div>
      <div className="order-row__totals">
        <span>{formatMoney(totals.USD ?? 0, 'USD')}</span>
        <strong>{formatMoney(totals.UAH ?? 0, 'UAH')}</strong>
      </div>
      <button
        type="button"
        className="order-row__delete"
        aria-label={t('orders.delete')}
        onClick={(event) => {
          event.stopPropagation()
          onDelete()
        }}
      >
        ×
      </button>
    </article>
  )
}
