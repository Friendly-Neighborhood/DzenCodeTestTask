'use client'

import { formatDateLong, formatDateNumeric, formatMoney, useI18n, type Order, type TotalsByCurrency } from '@orders-hub/shared'

interface Props {
  order: Order
  totals: TotalsByCurrency
  engine: string
  onClose: () => void
}

export const OrderDetails = ({ order, totals, engine, onClose }: Props) => {
  const { locale, t } = useI18n()
  return (
    <aside className="order-details" data-testid="order-details">
      <div className="order-details__header">
        <div>
          <span className="order-details__eyebrow">{t('orders.details')}</span>
          <h2>{order.title}</h2>
          <p>{order.description}</p>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="order-details__meta">
        <div>
          <span>{t('orders.created')}</span>
          <strong>{formatDateNumeric(order.date)}</strong>
          <small>{formatDateLong(order.date, locale === 'ru' ? 'ru-RU' : 'en-US')}</small>
        </div>
        <div>
          <span>{t('orders.total')}</span>
          <strong>{formatMoney(totals.USD ?? 0, 'USD')}</strong>
          <small>{formatMoney(totals.UAH ?? 0, 'UAH')}</small>
        </div>
      </div>
      <div className="order-details__engine">Web Worker · {engine.toUpperCase()}</div>
      <div className="order-details__products">
        {order.products.length === 0 && <div className="empty-state">{t('orders.empty')}</div>}
        {order.products.map((product) => (
          <article key={product.id} className="detail-product">
            <span className={`detail-product__status ${product.isNew ? 'detail-product__status--new' : ''}`} />
            <div className="detail-product__copy">
              <strong>{product.title}</strong>
              <span>{product.type} · {product.serialNumber}</span>
            </div>
            <div className="detail-product__price">
              {product.price.map((price) => <span key={price.symbol}>{formatMoney(price.value, price.symbol)}</span>)}
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}
