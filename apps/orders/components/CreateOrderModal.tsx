'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useI18n } from '@orders-hub/shared'

const schema = z.object({
  title: z.string().trim().min(3, 'Minimum 3 characters').max(120, 'Maximum 120 characters'),
  description: z.string().trim().max(500, 'Maximum 500 characters')
})

type Values = z.infer<typeof schema>

interface Props {
  open: boolean
  busy: boolean
  onClose: () => void
  onSubmit: (values: Values) => Promise<void>
}

export const CreateOrderModal = ({ open, busy, onClose, onSubmit }: Props) => {
  const { t } = useI18n()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' }
  })

  if (!open) {
    return null
  }

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    reset()
  })

  return (
    <div className="modal-layer" role="presentation" onMouseDown={onClose}>
      <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="create-order-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-card__header">
          <h2 id="create-order-title">{t('orders.formTitle')}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="order-form" onSubmit={submit}>
          <label className="order-form__field">
            <span>{t('orders.name')}</span>
            <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} {...register('title')} autoFocus />
            {errors.title && <small className="order-form__error">{errors.title.message}</small>}
          </label>
          <label className="order-form__field">
            <span>{t('orders.description')}</span>
            <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows={4} {...register('description')} />
            {errors.description && <small className="order-form__error">{errors.description.message}</small>}
          </label>
          <div className="dialog-card__actions">
            <button type="button" className="btn btn-light" onClick={onClose}>{t('orders.cancel')}</button>
            <button type="submit" className="btn btn-success" disabled={busy}>{t('orders.save')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
