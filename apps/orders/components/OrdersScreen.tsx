'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDomainEvents, useI18n, type Order, type TotalsByCurrency } from '@orders-hub/shared'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { addOrder, closeOrder, deleteOrder, loadOrders, selectOrder } from '../lib/ordersSlice'
import { CreateOrderModal } from './CreateOrderModal'
import { DeleteOrderModal } from './DeleteOrderModal'
import { OrderDetails } from './OrderDetails'
import { OrderRow } from './OrderRow'

interface WorkerPayload {
  totals: Record<number, TotalsByCurrency>
  engine: string
}

export const OrdersScreen = () => {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const { items, selectedId, status, error, mutating } = useAppSelector((state) => state.orders)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null)
  const [totals, setTotals] = useState<Record<number, TotalsByCurrency>>({})
  const [engine, setEngine] = useState('wasm')
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    dispatch(loadOrders())
  }, [dispatch])

  useEffect(() => {
    const worker = new Worker('/orders/workers/totals.worker.js')
    workerRef.current = worker
    worker.onmessage = (event: MessageEvent<WorkerPayload>) => {
      setTotals(event.data.totals)
      setEngine(event.data.engine)
    }
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    workerRef.current?.postMessage({ orders: items })
  }, [items])

  const onDomainEvent = useCallback((event: { type: string }) => {
    if (event.type.startsWith('order.') || event.type.startsWith('product.')) {
      dispatch(loadOrders())
    }
  }, [dispatch])

  useDomainEvents(onDomainEvent)

  const selected = useMemo(() => items.find((order) => order.id === selectedId) ?? null, [items, selectedId])

  if (status === 'loading' && items.length === 0) {
    return <div className="orders-state"><span className="spinner-border spinner-border-sm" /> {t('orders.loading')}</div>
  }

  if (status === 'error' && items.length === 0) {
    return <div className="orders-state orders-state--error">{t('orders.error')}: {error}</div>
  }

  return (
    <section className="orders-page">
      <div className="orders-page__header">
        <div>
          <span className="orders-page__eyebrow">Inventory intake</span>
          <h1>{t('orders.title')}</h1>
          <p>{t('orders.subtitle')}</p>
        </div>
        <button type="button" className="btn btn-success orders-page__add" onClick={() => setCreateOpen(true)}>
          <span>＋</span>{t('orders.add')}
        </button>
      </div>

      <div className={`orders-workspace ${selected ? 'orders-workspace--split' : ''}`}>
        <div className="orders-list">
          {items.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              active={selectedId === order.id}
              totals={totals[order.id] ?? {}}
              onSelect={() => dispatch(selectOrder(order.id))}
              onDelete={() => setDeleteTarget(order)}
            />
          ))}
        </div>
        {selected && (
          <OrderDetails
            order={selected}
            totals={totals[selected.id] ?? {}}
            engine={engine}
            onClose={() => dispatch(closeOrder())}
          />
        )}
      </div>

      <CreateOrderModal
        open={createOpen}
        busy={mutating}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (values) => {
          const result = await dispatch(addOrder(values))
          if (addOrder.fulfilled.match(result)) {
            setCreateOpen(false)
          }
        }}
      />
      <DeleteOrderModal
        order={deleteTarget}
        busy={mutating}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async (order) => {
          const result = await dispatch(deleteOrder(order.id))
          if (deleteOrder.fulfilled.match(result)) {
            setDeleteTarget(null)
          }
        }}
      />
    </section>
  )
}
