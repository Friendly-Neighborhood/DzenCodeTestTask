'use client'

import { useCallback, useEffect } from 'react'
import { useDomainEvents, useI18n } from '@orders-hub/shared'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { loadProducts, loadProductTypes, setFilter } from '../lib/productsSlice'
import { ProductRow } from './ProductRow'

export const ProductsScreen = () => {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const { items, types, filter, status, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(loadProductTypes())
    dispatch(loadProducts())
  }, [dispatch])

  const refresh = useCallback((event: { type: string }) => {
    if (event.type.startsWith('order.') || event.type.startsWith('product.')) {
      dispatch(loadProductTypes())
      dispatch(loadProducts(filter))
    }
  }, [dispatch, filter])

  useDomainEvents(refresh)

  const changeFilter = (value: string) => {
    dispatch(setFilter(value))
    dispatch(loadProducts(value))
  }

  return (
    <section className="products-page">
      <div className="products-page__header">
        <div>
          <span className="products-page__eyebrow">Unified inventory</span>
          <h1>{t('products.title')}</h1>
          <p>{t('products.subtitle')}</p>
        </div>
        <label className="products-filter">
          <span>{t('products.type')}</span>
          <select className="form-select" aria-label={t('products.type')} value={filter} onChange={(event) => changeFilter(event.target.value)}>
            <option value="">{t('products.allTypes')}</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>

      <div className="products-page__summary">
        <span>{items.length} {t('nav.products').toLowerCase()}</span>
        {status === 'loading' && <span className="spinner-border spinner-border-sm" />}
      </div>

      {status === 'error' && items.length === 0 && <div className="products-state products-state--error">{t('products.error')}: {error}</div>}
      {status === 'loading' && items.length === 0 && <div className="products-state">{t('products.loading')}</div>}
      {status === 'ready' && items.length === 0 && <div className="products-state">{t('products.empty')}</div>}

      <div className="products-list">
        {items.map((product) => <ProductRow key={product.id} product={product} />)}
      </div>
    </section>
  )
}
