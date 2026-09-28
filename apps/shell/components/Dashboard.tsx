'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { fetchApiHealth, fetchOrders, useI18n, type Order } from '@orders-hub/shared'

const OrdersChart = dynamic(() => import('./OrdersChart').then((module) => module.OrdersChart), {
  loading: () => <div className="dashboard-card__skeleton" />,
  ssr: false
})

const OperationsMap = dynamic(() => import('./OperationsMap').then((module) => module.OperationsMap), {
  loading: () => <div className="dashboard-card__skeleton" />,
  ssr: false
})

export const Dashboard = () => {
  const { t } = useI18n()
  const [orders, setOrders] = useState<Order[]>([])
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    fetchApiHealth().then(() => setApiStatus('online')).catch(() => setApiStatus('offline'))
    fetchOrders().then(setOrders).catch(() => setOrders([]))
  }, [])

  const productsCount = useMemo(() => orders.reduce((total, order) => total + order.products.length, 0), [orders])

  return (
    <section className="dashboard">
      <div className="dashboard__hero">
        <div>
          <span className="dashboard__eyebrow">Orders & Products</span>
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>
        <a href="/orders" className="btn btn-success dashboard__action">{t('nav.orders')}</a>
      </div>

      <div className="dashboard__metrics">
        <article className="metric-card">
          <span className="metric-card__label">{t('dashboard.api')}</span>
          <strong className={`metric-card__value metric-card__value--${apiStatus}`}>{apiStatus}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">{t('nav.orders')}</span>
          <strong className="metric-card__value">{orders.length}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">{t('nav.products')}</span>
          <strong className="metric-card__value">{productsCount}</strong>
        </article>
        <article className="metric-card metric-card--wide">
          <span className="metric-card__label">{t('dashboard.architecture')}</span>
          <strong className="metric-card__architecture">{t('dashboard.architectureValue')}</strong>
        </article>
      </div>

      <div className="dashboard__grid">
        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t('dashboard.chart')}</h2>
            <span>Web optimized</span>
          </div>
          <OrdersChart orders={orders} />
        </article>
        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <h2>{t('dashboard.map')}</h2>
            <span>Leaflet</span>
          </div>
          <OperationsMap />
        </article>
      </div>
    </section>
  )
}
