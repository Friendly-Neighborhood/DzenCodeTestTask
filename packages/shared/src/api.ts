import type { Order, Product } from './types'

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
const tokenKey = 'orders-hub.access-token'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

const readToken = () => typeof window === 'undefined' ? null : window.sessionStorage.getItem(tokenKey)

const requestToken = async () => {
  const response = await fetch(`${apiUrl}/auth/guest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Authentication service is unavailable')
  }
  const payload = await response.json() as { token: string }
  window.sessionStorage.setItem(tokenKey, payload.token)
  return payload.token
}

const accessToken = async (refresh = false) => {
  if (typeof window === 'undefined') {
    return null
  }
  if (refresh) {
    window.sessionStorage.removeItem(tokenKey)
  }
  return readToken() ?? requestToken()
}

export const graphQLRequest = async <T>(query: string, variables?: Record<string, unknown>, retry = true): Promise<T> => {
  const token = await accessToken()
  const response = await fetch(`${apiUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables })
  })
  if (response.status === 401 && retry) {
    await accessToken(true)
    return graphQLRequest<T>(query, variables, false)
  }
  const payload = await response.json() as GraphQLResponse<T>
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(payload.errors?.[0]?.message ?? `GraphQL request failed with ${response.status}`)
  }
  return payload.data
}

export const fetchOrders = async () => {
  const data = await graphQLRequest<{ orders: Order[] }>(`
    query Orders {
      orders {
        id
        title
        date
        description
        products {
          id
          serialNumber
          isNew
          photo
          title
          type
          specification
          guarantee { start end }
          price { value symbol isDefault }
          order { id title }
          date
        }
      }
    }
  `)
  return data.orders
}

export const fetchProducts = async (type?: string) => {
  const data = await graphQLRequest<{ products: Product[] }>(`
    query Products($type: String) {
      products(type: $type) {
        id
        serialNumber
        isNew
        photo
        title
        type
        specification
        guarantee { start end }
        price { value symbol isDefault }
        order { id title }
        date
      }
    }
  `, type ? { type } : {})
  return data.products
}

export const fetchProductTypes = async () => {
  const data = await graphQLRequest<{ productTypes: string[] }>(`query ProductTypes { productTypes }`)
  return data.productTypes
}

export const createOrder = async (input: { title: string; description: string }) => {
  const data = await graphQLRequest<{ createOrder: Order }>(`
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        id
        title
        date
        description
        products {
          id
          serialNumber
          isNew
          photo
          title
          type
          specification
          guarantee { start end }
          price { value symbol isDefault }
          order { id title }
          date
        }
      }
    }
  `, { input })
  return data.createOrder
}

export const removeOrder = async (id: number) => {
  const data = await graphQLRequest<{ deleteOrder: boolean }>(`
    mutation DeleteOrder($id: Int!) {
      deleteOrder(id: $id)
    }
  `, { id })
  return data.deleteOrder
}

export const fetchApiHealth = async () => {
  const response = await fetch(`${apiUrl}/health`)
  if (!response.ok) {
    throw new Error('API health check failed')
  }
  return response.json() as Promise<{ status: string; service: string }>
}
