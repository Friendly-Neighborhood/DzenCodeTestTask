import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { Server } from 'socket.io'

const port = Number(process.env.REALTIME_PORT ?? 4001)
const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'
const key = 'orders-hub:active-tabs'
const instanceId = randomUUID()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: true },
  transports: ['websocket', 'polling']
})

const pubClient = createClient({ url: redisUrl })
const subClient = pubClient.duplicate()
const stateClient = pubClient.duplicate()
const eventClient = pubClient.duplicate()
await Promise.all([pubClient.connect(), subClient.connect(), stateClient.connect(), eventClient.connect()])
io.adapter(createAdapter(pubClient, subClient))

const localMembers = new Set<string>()

const emitCount = async () => {
  const count = await stateClient.zCard(key)
  io.emit('sessions:count', count)
}

io.on('connection', async (socket) => {
  const member = `${instanceId}:${socket.id}`
  localMembers.add(member)
  await stateClient.zAdd(key, [{ score: Date.now(), value: member }])
  await emitCount()

  socket.on('disconnect', async () => {
    localMembers.delete(member)
    await stateClient.zRem(key, member)
    await emitCount()
  })
})

await eventClient.subscribe('domain.events', (message) => {
  try {
    io.emit('domain:event', JSON.parse(message))
  } catch {
    io.emit('domain:event', { type: 'unknown', aggregateId: 'unknown', at: new Date().toISOString() })
  }
})

const heartbeat = setInterval(async () => {
  const now = Date.now()
  if (localMembers.size > 0) {
    await stateClient.zAdd(key, [...localMembers].map((value) => ({ score: now, value })))
  }
}, 20000)

const cleanup = setInterval(async () => {
  await stateClient.zRemRangeByScore(key, 0, Date.now() - 60000)
  await emitCount()
}, 15000)

httpServer.listen(port, '0.0.0.0', () => {
  process.stdout.write(`realtime:${port}\n`)
})

const shutdown = async () => {
  clearInterval(heartbeat)
  clearInterval(cleanup)
  if (localMembers.size > 0) {
    await stateClient.zRem(key, [...localMembers])
  }
  io.close()
  httpServer.close()
  await Promise.all([pubClient.quit(), subClient.quit(), stateClient.quit(), eventClient.quit()])
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
