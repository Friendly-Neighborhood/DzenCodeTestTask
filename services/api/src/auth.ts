import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { Request } from 'express'

export interface AuthUser {
  id: string
  role: 'operator'
}

const secret = process.env.JWT_SECRET ?? 'local-development-secret-change-me'

export const createGuestToken = () => jwt.sign({ role: 'operator' }, secret, {
  subject: randomUUID(),
  expiresIn: '12h',
  issuer: 'orders-hub-api',
  audience: 'orders-hub-web'
})

export const readUser = (request: Request): AuthUser | null => {
  const header = request.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return null
  }
  try {
    const payload = jwt.verify(header.slice(7), secret, {
      issuer: 'orders-hub-api',
      audience: 'orders-hub-web'
    })
    if (typeof payload === 'string' || !payload.sub || payload.role !== 'operator') {
      return null
    }
    return { id: payload.sub, role: 'operator' }
  } catch {
    return null
  }
}
