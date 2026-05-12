import { create } from 'zustand'
import type { ConnectionStatus, SpeakerRole, TranscriptMessage } from '../types/transcript'
import { mockSocket } from '../services/mockSocket'
import { SPEAKER_ROLES } from '../utils/speakers'

interface TranscriptState {
  transcripts: TranscriptMessage[]
  connectionStatus: ConnectionStatus
  isPaused: boolean
  searchQuery: string
  mutedRoles: Record<SpeakerRole, boolean>
  rolePriority: SpeakerRole[]
  connect: () => void
  disconnect: () => void
  reconnect: () => void
  togglePause: () => void
  setSearchQuery: (value: string) => void
  toggleRoleMute: (role: SpeakerRole) => void
  setRolePriority: (priority: SpeakerRole[]) => void
  receiveMessage: (message: TranscriptMessage) => void
  editTranscript: (id: string, text: string) => void
}

let reconnectTimer: ReturnType<typeof setTimeout> | null = null

const DEFAULT_ROLE_PRIORITY = SPEAKER_ROLES.map((role) => role.role)

const loadRolePriority = (): SpeakerRole[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ROLE_PRIORITY
  }

  const raw = window.localStorage.getItem('rolePriority')
  if (!raw) {
    return DEFAULT_ROLE_PRIORITY
  }

  try {
    const parsed = JSON.parse(raw) as SpeakerRole[]
    const available = new Set(DEFAULT_ROLE_PRIORITY)
    const valid = parsed.filter((role) => available.has(role))
    if (valid.length !== DEFAULT_ROLE_PRIORITY.length) {
      return DEFAULT_ROLE_PRIORITY
    }
    return valid
  } catch {
    return DEFAULT_ROLE_PRIORITY
  }
}

export const useTranscriptStore = create<TranscriptState>((set, get) => ({
  transcripts: [],
  connectionStatus: 'disconnected',
  isPaused: false,
  searchQuery: '',
  mutedRoles: SPEAKER_ROLES.reduce((acc, role) => {
    acc[role.role] = false
    return acc
  }, {} as Record<SpeakerRole, boolean>),
  rolePriority: loadRolePriority(),
  connect: () => {
    if (get().connectionStatus === 'connected') {
      return
    }
    set({ connectionStatus: 'connected' })
    mockSocket.connect()
  },
  disconnect: () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    mockSocket.disconnect()
    set({ connectionStatus: 'disconnected' })
  },
  reconnect: () => {
    if (get().connectionStatus === 'reconnecting') {
      return
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }
    set({ connectionStatus: 'reconnecting' })
    mockSocket.reconnect()
    reconnectTimer = setTimeout(() => {
      set({ connectionStatus: 'connected' })
    }, 1400)
  },
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setSearchQuery: (value) => set({ searchQuery: value }),
  toggleRoleMute: (role) =>
    set((state) => ({
      mutedRoles: { ...state.mutedRoles, [role]: !state.mutedRoles[role] },
    })),
  setRolePriority: (priority) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('rolePriority', JSON.stringify(priority))
    }
    set({ rolePriority: priority })
  },
  receiveMessage: (message) =>
    set((state) => {
      if (state.isPaused) {
        return state
      }

      const nextMessage = {
        ...message,
        isMuted: state.mutedRoles[message.role] || false,
      }

      const index = state.transcripts.findIndex((item) => item.id === message.id)

      if (index === -1) {
        return { transcripts: [...state.transcripts, nextMessage] }
      }

      const existing = state.transcripts[index]

      if (existing.isEdited) {
        return state
      }

      const updated = [...state.transcripts]
      updated[index] = {
        ...existing,
        text: message.text,
        timestamp: message.timestamp,
        isMuted: false,
      }

      return { transcripts: updated }
    }),
  editTranscript: (id, text) =>
    set((state) => ({
      transcripts: state.transcripts.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
              isEdited: true,
            }
          : item,
      ),
    })),
}))
