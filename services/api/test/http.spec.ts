import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { createHttpApp } from '../src/app'

let app: Express

beforeAll(async () => {
  app = await createHttpApp()
})

afterAll(() => undefined)

describe('api http surface', () => {
  it('reports health', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok', service: 'api' })
  })

  it('issues a jwt session token', async () => {
    const response = await request(app).post('/auth/guest').send({})
    expect(response.status).toBe(200)
    expect(response.body.token.split('.')).toHaveLength(3)
  })

  it('rejects graphql without a token', async () => {
    const response = await request(app).post('/graphql').send({ query: '{ productTypes }' })
    expect(response.status).toBe(401)
  })
})
