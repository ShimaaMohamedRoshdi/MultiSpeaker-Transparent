export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

export type SpeakerRole =
  | 'Judge'
  | 'Prosecutor'
  | 'Defendant'
  | 'Lawyer'
  | 'Witnesses'
  | 'Experts'
  | 'CivilPlaintiff'

export interface TranscriptMessage {
  id: string
  speakerId: number
  speakerName: string
  role: SpeakerRole
  text: string
  timestamp: string
  isEdited: boolean
  isMuted: boolean
}

export interface Speaker {
  id: number
  name: string
  role: SpeakerRole
  roleLabel: string
  color: string
  avatar: string
}
