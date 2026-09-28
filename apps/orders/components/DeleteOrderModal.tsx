'use client'

import { useI18n, type Order } from '@orders-hub/shared'

interface Props {
  order: Order | null
  busy: boolean
  onClose: () => void
  onConfirm: (order: Order) => Promise<void>
}

export const DeleteOrderModal = ({ order, busy, onClose, onConfirm }: Props) => {
  const { t } = useI18n()
  if (!order) {
    return null
  }

  return (
    <div className="modal-layer" role="presentation" onMouseDown={onClose}>
      <section className="dialog-card dialog-card--danger" role="dialog" aria-modal="true" aria-labelledby="delete-order-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-card__header">
          <div>
            <h2 id="delete-order-title">{t('orders.confirmTitle')}</h2>
            <p>{order.title}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="dialog-card__copy">{t('orders.confirmBody')}</p>
        <div className="dialog-card__actions">
          <button type="button" className="btn btn-light" onClick={onClose}>{t('orders.cancel')}</button>
          <button type="button" className="btn btn-danger" disabled={busy} onClick={() => onConfirm(order)}>{t('orders.confirm')}</button>
        </div>
      </section>
    </div>
  )
}
