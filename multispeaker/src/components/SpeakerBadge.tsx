import type { Speaker } from '../types/transcript'

interface SpeakerBadgeProps {
  speaker: Speaker | undefined
}

export default function SpeakerBadge({ speaker }: SpeakerBadgeProps) {
  if (!speaker) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-11 w-11 place-items-center rounded-2xl text-xs font-semibold text-[#0f0f0f] shadow-[0_12px_30px_rgba(139,69,19,0.18)]"
        style={{ backgroundColor: speaker.color }}
      >
        {speaker.avatar}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#5a4a3a]">{speaker.name}</span>
        <span className="text-xs text-[#a08c6d]">{speaker.roleLabel}</span>
      </div>
    </div>
  )
}
