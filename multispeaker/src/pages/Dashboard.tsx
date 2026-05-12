import { useMemo } from 'react'
import HeaderToolbar from '../components/HeaderToolbar'
import MuteControls from '../components/MuteControls'
import RolePriorityControls from '../components/RolePriorityControls'
import SessionControls from '../components/SessionControls'
import TranscriptViewer from '../components/TranscriptViewer'
import { useTranscriptStream } from '../hooks/useTranscriptStream'
import { useTranscriptStore } from '../store/transcriptStore'
import { ROLE_MAP, SPEAKERS } from '../utils/speakers'

export default function Dashboard() {
  useTranscriptStream()

  const transcripts = useTranscriptStore((state) => state.transcripts)
  const searchQuery = useTranscriptStore((state) => state.searchQuery)
  const editTranscript = useTranscriptStore((state) => state.editTranscript)
  const rolePriority = useTranscriptStore((state) => state.rolePriority)
  const isPriorityEnabled = useTranscriptStore((state) => state.isPriorityEnabled)

  const filtered = useMemo(() => {
    if (!searchQuery) {
      return transcripts
    }
    const query = searchQuery.toLowerCase()
    return transcripts.filter((item) => {
      const roleLabel = ROLE_MAP[item.role]?.label ?? ''
      return (
        item.text.toLowerCase().includes(query) ||
        item.speakerName.toLowerCase().includes(query) ||
        roleLabel.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, transcripts])

  const stats = useMemo(() => {
    const totals = {
      total: transcripts.length,
      edited: transcripts.filter((item) => item.isEdited).length,
    }
    return totals
  }, [transcripts])

  const ordered = useMemo(() => {
    if (!isPriorityEnabled) {
      return [...filtered].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
    }
    const priorityIndex = new Map(rolePriority.map((role, index) => [role, index]))
    return [...filtered].sort((a, b) => {
      const rankA = priorityIndex.get(a.role) ?? 999
      const rankB = priorityIndex.get(b.role) ?? 999
      if (rankA !== rankB) {
        return rankA - rankB
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    })
  }, [filtered, isPriorityEnabled, rolePriority])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f3] via-[#f5f2e8] to-[#f0ead6] text-[#5a4a3a]">
      <div className="no-print">
        <HeaderToolbar />
        <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-12 pt-6 lg:grid-cols-[360px,1fr]">
          <aside className="space-y-6">
          <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">ملخص الجلسة</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-amber-200 bg-[#faf8f3] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a08c6d]">الإجمالي</p>
                <p className="mt-2 text-2xl font-semibold text-[#5a4a3a]">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">المعدل</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-600">{stats.edited}</p>
              </div>
            </div>
          </div>

          <SessionControls />
          <MuteControls />
          <RolePriorityControls />

          <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">أطراف الجلسة</p>
            <div className="mt-4 space-y-3">
              {SPEAKERS.map((speaker) => (
                <div
                  key={speaker.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-[#faf8f3] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-9 w-9 place-items-center rounded-xl text-xs font-semibold text-[#0f0f0f]"
                      style={{ backgroundColor: speaker.color }}
                    >
                      {speaker.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#5a4a3a]">{speaker.name}</p>
                      <p className="text-xs text-[#a08c6d]">
                        {ROLE_MAP[speaker.role]?.label}
                      </p>
                    </div>
                  </div>
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: speaker.color }}
                  />
                </div>
              ))}
            </div>
          </div>
          </aside>

          <TranscriptViewer items={ordered} query={searchQuery} onEdit={editTranscript} />
        </main>
      </div>

      <section className="print-only px-8 pb-8 pt-6">
        <div className="mb-6 border-b border-slate-300 pb-4">
          <h1 className="text-2xl font-semibold">محضر جلسة المحكمة</h1>
          <p className="text-sm text-slate-600">سجل المحضر المُولد</p>
        </div>
        <div className="space-y-4">
          {ordered.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="font-semibold">{item.speakerName}</div>
                <div className="text-slate-600">{ROLE_MAP[item.role]?.label}</div>
                <div className="text-slate-500">{new Date(item.timestamp).toLocaleString()}</div>
              </div>
              <p className="mt-2 text-base text-slate-900">{item.text}</p>
              {item.isEdited ? (
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-600">
                  معدل
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
