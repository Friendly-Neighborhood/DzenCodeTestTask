'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Order } from '@orders-hub/shared'

export const OrdersChart = ({ orders }: { orders: Order[] }) => {
  const data = orders.map((order) => ({
    name: order.title.split('·')[0]?.trim() ?? order.title,
    value: order.products.reduce((total, product) => total + (product.price.find((price) => price.symbol === 'USD')?.value ?? 0), 0)
  }))

  return (
    <div className="dashboard-card__chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} fontSize={11} width={48} />
          <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'USD']} />
          <Bar dataKey="value" fill="var(--accent)" radius={[7, 7, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
