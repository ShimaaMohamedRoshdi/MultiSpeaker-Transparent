import { useCallback, useMemo, useState } from 'react'
import { SPEAKER_ROLES } from '../utils/speakers'
import { useTranscriptStore } from '../store/transcriptStore'
import type { SpeakerRole } from '../types/transcript'

export default function RolePriorityControls() {
  const rolePriority = useTranscriptStore((state) => state.rolePriority)
  const setRolePriority = useTranscriptStore((state) => state.setRolePriority)
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
    [draggedRole, rolePriority, setRolePriority],
  )

  return (
    <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">أولوية الأدوار</p>
      <p className="mt-2 text-xs text-[#a08c6d]">
        اسحب لإعادة ترتيب أولوية الأدوار في قائمة المحضر.
      </p>
      <div className="mt-4 space-y-3">
        {orderedRoles.map((role) => (
          <div
            key={role.role}
            draggable
            onDragStart={() => setDraggedRole(role.role)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(role.role)}
            className="flex items-center justify-between rounded-2xl border border-amber-200 bg-[#faf8f3] px-4 py-3"
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
            <div className="text-xs uppercase tracking-[0.2em] text-[#a08c6d]">سحب</div>
          </div>
        ))}
      </div>
    </div>
  )
}
