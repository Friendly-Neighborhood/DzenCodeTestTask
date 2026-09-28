import type { Prisma } from '@prisma/client'
import { db } from './db.js'
import { publishDomainEvent } from './pubsub.js'
import type { AuthUser } from './auth.js'

type ProductRecord = Prisma.ProductGetPayload<{ include: { prices: true; order: true } }>
type OrderRecord = Prisma.OrderGetPayload<{ include: { products: { include: { prices: true; order: true } } } }>

interface Context {
  user: AuthUser | null
}

const requireUser = (context: Context) => {
  if (!context.user) {
    throw new Error('Unauthorized')
  }
}

const mapProduct = (product: ProductRecord) => ({
  id: product.id,
  serialNumber: product.serialNumber,
  isNew: product.isNew,
  photo: product.photo,
  title: product.title,
  type: product.type,
  specification: product.specification,
  guarantee: {
    start: product.guaranteeStart.toISOString(),
    end: product.guaranteeEnd.toISOString()
  },
  price: product.prices.map((price) => ({
    value: Number(price.value),
    symbol: price.symbol,
    isDefault: price.isDefault
  })),
  order: {
    id: product.order.id,
    title: product.order.title
  },
  date: product.createdAt.toISOString()
})

const mapOrder = (order: OrderRecord) => ({
  id: order.id,
  title: order.title,
  date: order.createdAt.toISOString(),
  description: order.description,
  products: order.products.map(mapProduct)
})

export const resolvers = {
  Query: {
    orders: async (_parent: unknown, _args: unknown, context: Context) => {
      requireUser(context)
      const orders = await db.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
            include: { prices: true, order: true }
          }
        }
      })
      return orders.map(mapOrder)
    },
    products: async (_parent: unknown, args: { type?: string }, context: Context) => {
      requireUser(context)
      const products = await db.product.findMany({
        where: args.type ? { type: args.type } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { prices: true, order: true }
      })
      return products.map(mapProduct)
    },
    productTypes: async (_parent: unknown, _args: unknown, context: Context) => {
      requireUser(context)
      const rows = await db.product.findMany({
        distinct: ['type'],
        select: { type: true },
        orderBy: { type: 'asc' }
      })
      return rows.map((row) => row.type)
    }
  },
  Mutation: {
    createOrder: async (_parent: unknown, args: { input: { title: string; description: string } }, context: Context) => {
      requireUser(context)
      const title = args.input.title.trim()
      const description = args.input.description.trim()
      if (title.length < 3 || title.length > 120 || description.length > 500) {
        throw new Error('Invalid order payload')
      }
      const order = await db.order.create({
        data: { title, description },
        include: {
          products: {
            include: { prices: true, order: true }
          }
        }
      })
      await publishDomainEvent({ type: 'order.created', aggregateId: order.id, at: new Date().toISOString() })
      return mapOrder(order)
    },
    deleteOrder: async (_parent: unknown, args: { id: number }, context: Context) => {
      requireUser(context)
      const existing = await db.order.findUnique({ where: { id: args.id }, select: { id: true } })
      if (!existing) {
        return false
      }
      await db.order.delete({ where: { id: args.id } })
      await publishDomainEvent({ type: 'order.deleted', aggregateId: args.id, at: new Date().toISOString() })
      return true
    }
  }
}
