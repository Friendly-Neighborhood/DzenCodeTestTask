import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import express, { type Request } from 'express'
import { createGuestToken, readUser, type AuthUser } from './auth.js'
import { resolvers } from './resolvers.js'
import { typeDefs } from './schema.js'

interface AuthorizedRequest extends Request {
  authUser?: AuthUser
}

export const createHttpApp = async () => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors({ origin: true, credentials: false }))

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok', service: 'api' })
  })

  app.post('/auth/guest', express.json(), (_request, response) => {
    response.json({ token: createGuestToken() })
  })

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()

  app.use('/graphql', (request: AuthorizedRequest, response, next) => {
    const user = readUser(request)
    if (!user) {
      response.status(401).json({ errors: [{ message: 'Unauthorized' }] })
      return
    }
    request.authUser = user
    next()
  }, express.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ user: (req as AuthorizedRequest).authUser ?? null })
  }))

  return app
}
