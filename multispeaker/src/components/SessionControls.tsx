import ConnectionStatus from './ConnectionStatus'
import PrintSessionButton from './PrintSessionButton'
import { useTranscriptStore } from '../store/transcriptStore'
import { exportTranscriptsJson } from '../utils/export'

export default function SessionControls() {
  const transcripts = useTranscriptStore((state) => state.transcripts)
  const isPaused = useTranscriptStore((state) => state.isPaused)
  const togglePause = useTranscriptStore((state) => state.togglePause)
  const reconnect = useTranscriptStore((state) => state.reconnect)

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">إدارة الجلسة</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ConnectionStatus />
        <button
          type="button"
          onClick={togglePause}
          className="rounded-full border border-amber-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#8b7355] hover:border-amber-400"
        >
          {isPaused ? 'استئناف البث' : 'إيقاف البث مؤقتا'}
        </button>
        <button
          type="button"
          onClick={reconnect}
          className="rounded-full border border-red-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-600 hover:border-red-400"
        >
          إعادة الاتصال
        </button>
        <button
          type="button"
          onClick={() => exportTranscriptsJson(transcripts)}
          className="rounded-full border border-amber-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-600 hover:border-amber-400"
        >
          تصدير بصيغة JSON
        </button>
        <PrintSessionButton className="rounded-full bg-amber-500 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white hover:bg-amber-600" />
      </div>
    </div>
  )
}
