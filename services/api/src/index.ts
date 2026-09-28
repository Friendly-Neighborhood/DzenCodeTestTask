import { createHttpApp } from './app.js'
import { db } from './db.js'
import { closePublisher } from './pubsub.js'

const port = Number(process.env.PORT ?? 4000)
const app = await createHttpApp()
const server = app.listen(port, '0.0.0.0', () => {
  process.stdout.write(`api:${port}\n`)
})

const shutdown = async () => {
  server.close()
  await Promise.all([db.$disconnect(), closePublisher()])
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
