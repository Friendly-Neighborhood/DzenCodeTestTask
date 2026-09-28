'use client'

import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import type { DomainEvent } from './types'

let socket: Socket | null = null

const getSocket = () => {
  if (typeof window === 'undefined') {
    return null
  }
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelayMax: 5000
    })
  }
  return socket
}

export const useActiveSessions = () => {
  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const instance = getSocket()
    if (!instance) {
      return
    }
    const onCount = (value: number) => setCount(value)
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    instance.on('sessions:count', onCount)
    instance.on('connect', onConnect)
    instance.on('disconnect', onDisconnect)
    if (instance.connected) {
      setConnected(true)
    }
    return () => {
      instance.off('sessions:count', onCount)
      instance.off('connect', onConnect)
      instance.off('disconnect', onDisconnect)
    }
  }, [])

  return { count, connected }
}

export const useDomainEvents = (handler: (event: DomainEvent) => void) => {
  useEffect(() => {
    const instance = getSocket()
    if (!instance) {
      return
    }
    instance.on('domain:event', handler)
    return () => {
      instance.off('domain:event', handler)
    }
  }, [handler])
}
