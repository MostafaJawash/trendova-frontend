import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

export function useRealtime(channelName, eventName, onEvent) {
  const [live, setLive] = useState(false)
  useEffect(() => {
    if (!channelName) return undefined
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY || 'trendova-key', { cluster: 'mt1', wsHost: import.meta.env.VITE_PUSHER_HOST || 'localhost', wsPort: Number(import.meta.env.VITE_PUSHER_PORT || 6001), forceTLS: false, enabledTransports: ['ws', 'wss'], disableStats: true, channelAuthorization: { endpoint: '/api/v1/broadcasting/auth', headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } } })
    const channel = pusher.subscribe(channelName)
    channel.bind(eventName, onEvent); pusher.connection.bind('connected', () => setLive(true)); pusher.connection.bind('disconnected', () => setLive(false)); pusher.connection.bind('error', () => setLive(false))
    return () => { channel.unbind(eventName, onEvent); pusher.unsubscribe(channelName); pusher.disconnect() }
  }, [channelName, eventName, onEvent])
  return live
}
