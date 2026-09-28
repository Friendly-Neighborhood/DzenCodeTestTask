import { db } from './db.js'

const seed = async () => {
  const existing = await db.order.count()
  if (existing > 0) {
    return
  }

  const order1 = await db.order.create({
    data: {
      title: 'Order 1 · Display Lab',
      description: 'Monitors for the design and QA workstations',
      createdAt: new Date('2017-06-29T12:09:33.000Z')
    }
  })
  const order2 = await db.order.create({
    data: {
      title: 'Order 2 · Engineering',
      description: 'Laptops and peripherals for engineering teams',
      createdAt: new Date('2024-02-14T09:35:00.000Z')
    }
  })
  const order3 = await db.order.create({
    data: {
      title: 'Order 3 · Mobile Lab',
      description: 'Mobile devices for field testing',
      createdAt: new Date('2025-01-22T16:10:00.000Z')
    }
  })

  const products = [
    {
      orderId: order1.id,
      serialNumber: 'MN-1234-A',
      isNew: true,
      photo: 'monitor-dell.jpg',
      title: 'Dell UltraSharp U2723QE',
      type: 'Monitors',
      specification: '27 inch 4K IPS Black USB-C Hub',
      guaranteeStart: new Date('2017-06-29T12:09:33.000Z'),
      guaranteeEnd: new Date('2020-06-29T12:09:33.000Z'),
      createdAt: new Date('2017-06-29T12:09:33.000Z'),
      prices: { create: [{ value: 629, symbol: 'USD', isDefault: false }, { value: 24531, symbol: 'UAH', isDefault: true }] }
    },
    {
      orderId: order1.id,
      serialNumber: 'MN-1234-B',
      isNew: true,
      photo: 'monitor-lg.jpg',
      title: 'LG UltraGear 27GP850',
      type: 'Monitors',
      specification: '27 inch QHD Nano IPS 165Hz',
      guaranteeStart: new Date('2017-06-29T12:09:33.000Z'),
      guaranteeEnd: new Date('2020-06-29T12:09:33.000Z'),
      createdAt: new Date('2017-06-29T12:14:33.000Z'),
      prices: { create: [{ value: 499, symbol: 'USD', isDefault: false }, { value: 19461, symbol: 'UAH', isDefault: true }] }
    },
    {
      orderId: order2.id,
      serialNumber: 'NB-8891-T',
      isNew: true,
      photo: 'thinkpad.jpg',
      title: 'ThinkPad T14 Gen 5',
      type: 'Laptops',
      specification: '14 inch, 32GB RAM, 1TB SSD',
      guaranteeStart: new Date('2024-02-14T09:35:00.000Z'),
      guaranteeEnd: new Date('2027-02-14T09:35:00.000Z'),
      createdAt: new Date('2024-02-14T09:35:00.000Z'),
      prices: { create: [{ value: 1499, symbol: 'USD', isDefault: false }, { value: 58461, symbol: 'UAH', isDefault: true }] }
    },
    {
      orderId: order2.id,
      serialNumber: 'NB-9013-M',
      isNew: true,
      photo: 'macbook.jpg',
      title: 'MacBook Pro 14',
      type: 'Laptops',
      specification: 'Apple silicon, 18GB unified memory, 512GB SSD',
      guaranteeStart: new Date('2024-02-14T09:35:00.000Z'),
      guaranteeEnd: new Date('2026-02-14T09:35:00.000Z'),
      createdAt: new Date('2024-02-14T09:42:00.000Z'),
      prices: { create: [{ value: 1999, symbol: 'USD', isDefault: false }, { value: 77961, symbol: 'UAH', isDefault: true }] }
    },
    {
      orderId: order2.id,
      serialNumber: 'PR-4421-X',
      isNew: false,
      photo: 'mouse.jpg',
      title: 'Logitech MX Master 3S',
      type: 'Peripherals',
      specification: 'Wireless productivity mouse',
      guaranteeStart: new Date('2024-02-14T09:35:00.000Z'),
      guaranteeEnd: new Date('2025-02-14T09:35:00.000Z'),
      createdAt: new Date('2024-02-14T10:03:00.000Z'),
      prices: { create: [{ value: 99, symbol: 'USD', isDefault: false }, { value: 3861, symbol: 'UAH', isDefault: true }] }
    },
    {
      orderId: order3.id,
      serialNumber: 'TB-7500-I',
      isNew: true,
      photo: 'tablet.jpg',
      title: 'iPad Air 11',
      type: 'Tablets',
      specification: '11 inch mobile test device, 256GB',
      guaranteeStart: new Date('2025-01-22T16:10:00.000Z'),
      guaranteeEnd: new Date('2027-01-22T16:10:00.000Z'),
      createdAt: new Date('2025-01-22T16:10:00.000Z'),
      prices: { create: [{ value: 699, symbol: 'USD', isDefault: false }, { value: 27261, symbol: 'UAH', isDefault: true }] }
    }
  ]

  for (const product of products) {
    await db.product.create({ data: product })
  }
}

seed().finally(async () => {
  await db.$disconnect()
})
