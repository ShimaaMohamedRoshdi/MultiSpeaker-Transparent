import { useMemo } from 'react'
import { SPEAKER_ROLES } from '../utils/speakers'
import { useTranscriptStore } from '../store/transcriptStore'

export default function MuteControls() {
  const mutedRoles = useTranscriptStore((state) => state.mutedRoles)
  const toggleRoleMute = useTranscriptStore((state) => state.toggleRoleMute)

  const items = useMemo(
    () =>
      SPEAKER_ROLES.map((role) => ({
        ...role,
        isMuted: mutedRoles[role.role],
      })),
    [mutedRoles],
  )

  return (
    <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">كتم الأدوار</p>
      <div className="mt-4 space-y-3">
        {items.map((role) => (
          <div
            key={role.role}
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
            <button
              type="button"
              onClick={() => toggleRoleMute(role.role)}
              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition ${
                role.isMuted
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-amber-300 text-[#8b7355] hover:border-amber-400'
              }`}
            >
              {role.isMuted ? 'مكتوم' : 'مباشر'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
