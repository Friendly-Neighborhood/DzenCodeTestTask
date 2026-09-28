import { createClient } from 'redis'

const publisher = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })

export const publishDomainEvent = async (event: { type: string; aggregateId: number | string; at: string }) => {
  try {
    if (!publisher.isOpen) {
      await publisher.connect()
    }
    await publisher.publish('domain.events', JSON.stringify(event))
    return true
  } catch {
    return false
  }
}

export const closePublisher = async () => {
  if (publisher.isOpen) {
    await publisher.quit()
  }
}
