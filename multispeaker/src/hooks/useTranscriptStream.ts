import { useEffect } from 'react'
import { mockSocket } from '../services/mockSocket'
import { useTranscriptStore } from '../store/transcriptStore'

export function useTranscriptStream() {
  const connect = useTranscriptStore((state) => state.connect)
  const disconnect = useTranscriptStore((state) => state.disconnect)
  const receiveMessage = useTranscriptStore((state) => state.receiveMessage)

  useEffect(() => {
    connect()
    const unsubscribe = mockSocket.subscribe((message) => {
      receiveMessage(message)
    })

    return () => {
      unsubscribe()
      disconnect()
    }
  }, [connect, disconnect, receiveMessage])
}
