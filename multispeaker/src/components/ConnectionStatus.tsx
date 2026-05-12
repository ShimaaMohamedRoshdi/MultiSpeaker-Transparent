import { useMemo } from 'react'
import { useTranscriptStore } from '../store/transcriptStore'

const STATUS_STYLES: Record<string, string> = {
  connected: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  disconnected: 'bg-red-50 text-red-700 border-red-300',
  reconnecting: 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse',
}

export default function ConnectionStatus() {
  const status = useTranscriptStore((state) => state.connectionStatus)

  const label = useMemo(() => {
    if (status === 'reconnecting') {
      return 'إعادة الاتصال'
    }
    if (status === 'connected') {
      return 'مباشر'
    }
    return 'غير متصل'
  }, [status])

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${
        STATUS_STYLES[status]
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
