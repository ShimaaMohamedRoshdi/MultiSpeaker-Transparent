import type { TranscriptMessage } from '../types/transcript'

export function exportTranscriptsJson(items: TranscriptMessage[]) {
  const payload = JSON.stringify(items, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'courtroom-session-transcript.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
