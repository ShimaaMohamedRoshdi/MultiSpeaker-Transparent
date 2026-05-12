import { useCallback, useMemo, useState } from 'react'
import { SPEAKER_ROLES } from '../utils/speakers'
import { useTranscriptStore } from '../store/transcriptStore'
import type { SpeakerRole } from '../types/transcript'

export default function RolePriorityControls() {
  const rolePriority = useTranscriptStore((state) => state.rolePriority)
  const setRolePriority = useTranscriptStore((state) => state.setRolePriority)
  const isPriorityEnabled = useTranscriptStore((state) => state.isPriorityEnabled)
  const togglePriorityEnabled = useTranscriptStore((state) => state.togglePriorityEnabled)
  const [draggedRole, setDraggedRole] = useState<SpeakerRole | null>(null)

  const orderedRoles = useMemo(() => {
    const roleMap = SPEAKER_ROLES.reduce<Record<SpeakerRole, (typeof SPEAKER_ROLES)[0]>>(
      (acc, role) => {
        acc[role.role] = role
        return acc
      },
      {} as Record<SpeakerRole, (typeof SPEAKER_ROLES)[0]>,
    )

    return rolePriority.map((role) => roleMap[role]).filter(Boolean)
  }, [rolePriority])

  const handleDrop = useCallback(
    (targetRole: SpeakerRole) => {
      if (!isPriorityEnabled) {
        setDraggedRole(null)
        return
      }
      if (!draggedRole || draggedRole === targetRole) {
        setDraggedRole(null)
        return
      }

      const next = [...rolePriority]
      const fromIndex = next.indexOf(draggedRole)
      const toIndex = next.indexOf(targetRole)
      if (fromIndex === -1 || toIndex === -1) {
        setDraggedRole(null)
        return
      }

      next.splice(fromIndex, 1)
      next.splice(toIndex, 0, draggedRole)
      setRolePriority(next)
      setDraggedRole(null)
    },
    [draggedRole, isPriorityEnabled, rolePriority, setRolePriority],
  )

  return (
    <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">أولوية الأدوار</p>
      <p className="mt-2 text-xs text-[#a08c6d]">
        اسحب لإعادة ترتيب أولوية الأدوار في قائمة المحضر.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${
            isPriorityEnabled
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          {isPriorityEnabled ? 'مفعل' : 'معطل'}
        </span>
        <button
          type="button"
          onClick={togglePriorityEnabled}
          className="rounded-full border border-amber-300 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8b7355] hover:border-amber-400"
        >
          {isPriorityEnabled ? 'إيقاف الأولوية' : 'تفعيل الأولوية'}
        </button>
        <button
          type="button"
          onClick={() => setRolePriority(SPEAKER_ROLES.map((role) => role.role))}
          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-600 hover:border-slate-300"
        >
          إعادة الضبط
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {orderedRoles.map((role) => (
          <div
            key={role.role}
            draggable={isPriorityEnabled}
            onDragStart={() => {
              if (isPriorityEnabled) {
                setDraggedRole(role.role)
              }
            }}
            onDragOver={(event) => {
              if (isPriorityEnabled) {
                event.preventDefault()
              }
            }}
            onDrop={() => handleDrop(role.role)}
            className={`flex items-center justify-between rounded-2xl border border-amber-200 bg-[#faf8f3] px-4 py-3 ${
              isPriorityEnabled ? 'cursor-grab' : 'cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="grid h-9 w-9 place-items-center rounded-xl text-xs font-semibold text-[#0f0f0f]"
                style={{ backgroundColor: role.color }}
              >
                {role.badge}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#5a4a3a]">{role.label}</p>
                <p className="text-xs text-[#a08c6d]">{role.role}</p>
              </div>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#a08c6d]">
              {isPriorityEnabled ? 'سحب' : 'متوقف'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
