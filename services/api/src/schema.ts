export const typeDefs = `
  type Money {
    value: Float!
    symbol: String!
    isDefault: Boolean!
  }

  type Guarantee {
    start: String!
    end: String!
  }

  type OrderRef {
    id: Int!
    title: String!
  }

  type Product {
    id: Int!
    serialNumber: String!
    isNew: Boolean!
    photo: String!
    title: String!
    type: String!
    specification: String!
    guarantee: Guarantee!
    price: [Money!]!
    order: OrderRef!
    date: String!
  }

  type Order {
    id: Int!
    title: String!
    date: String!
    description: String!
    products: [Product!]!
  }

  input CreateOrderInput {
    title: String!
    description: String!
  }

  type Query {
    orders: [Order!]!
    products(type: String): [Product!]!
    productTypes: [String!]!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    deleteOrder(id: Int!): Boolean!
  }
`
