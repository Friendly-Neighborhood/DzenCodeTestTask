'use client'

import { formatDateLong, formatDateNumeric, formatMoney, useI18n, type Product } from '@orders-hub/shared'

export const ProductRow = ({ product }: { product: Product }) => {
  const { locale, t } = useI18n()
  return (
    <article className="product-row" data-testid="product-row">
      <div className="product-row__identity">
        <span className={`product-row__dot ${product.isNew ? 'product-row__dot--new' : ''}`} />
        <div className="product-row__avatar">{product.title.slice(0, 1).toUpperCase()}</div>
        <div className="product-row__title">
          <strong>{product.title}</strong>
          <span>{product.specification}</span>
          <small>{t('products.serial')}: {product.serialNumber}</small>
        </div>
      </div>
      <div className="product-row__cell">
        <span>{t('products.type')}</span>
        <strong>{product.type}</strong>
        <small className={product.isNew ? 'product-row__status product-row__status--new' : 'product-row__status'}>{product.isNew ? t('status.new') : t('status.used')}</small>
      </div>
      <div className="product-row__cell product-row__guarantee">
        <span>{t('products.guarantee')}</span>
        <strong>{formatDateNumeric(product.guarantee.start)}</strong>
        <small>{formatDateLong(product.guarantee.end, locale === 'ru' ? 'ru-RU' : 'en-US')}</small>
      </div>
      <div className="product-row__cell product-row__price">
        <span>{t('products.price')}</span>
        {product.price.map((price) => (
          <strong key={price.symbol} className={price.isDefault ? 'product-row__price-default' : ''}>{formatMoney(price.value, price.symbol)}</strong>
        ))}
      </div>
      <div className="product-row__cell product-row__order">
        <span>{t('products.order')}</span>
        <a href={`/orders#order-${product.order.id}`}>{product.order.title}</a>
      </div>
    </article>
  )
}
