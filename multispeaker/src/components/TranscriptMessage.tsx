import { useCallback, useMemo, useState } from 'react'
import type { TranscriptMessage as TranscriptMessageType } from '../types/transcript'
import { ROLE_MAP, SPEAKER_MAP } from '../utils/speakers'
import { highlightText } from '../utils/highlight'
import SpeakerBadge from './SpeakerBadge'

interface TranscriptMessageProps {
  item: TranscriptMessageType
  query: string
  onEdit: (id: string, text: string) => void
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function TranscriptMessage({ item, query, onEdit }: TranscriptMessageProps) {
  const speaker = SPEAKER_MAP[item.speakerId]
  const role = ROLE_MAP[item.role]
  const [isEditing, setIsEditing] = useState(false)

  const highlight = useMemo(() => {
    if (isEditing || !query) {
      return item.text
    }
    return highlightText(item.text, query)
  }, [isEditing, item.text, query])

  const handleInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const nextText = event.currentTarget.textContent ?? ''
      if (nextText !== item.text) {
        onEdit(item.id, nextText)
      }
    },
    [item.id, item.text, onEdit],
  )

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }, [])

  return (
    <article className="animate-float-in rounded-[28px] border border-amber-200 bg-white p-6 shadow-[0_20px_45px_rgba(139,69,19,0.12)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <SpeakerBadge speaker={speaker} />
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#a08c6d]">
            <span>{formatTime(item.timestamp)}</span>
            <span className="h-1 w-1 rounded-full bg-amber-300" />
            <span className="rounded-full border border-amber-200 bg-[#faf8f3] px-2 py-1 text-[10px] text-[#8b7355]">
              {role?.label}
            </span>
            {item.isEdited ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] text-emerald-600">
                معدل
              </span>
            ) : null}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-[#faf8f3] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8b7355]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: speaker?.color }} />
          {item.speakerName}
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-amber-200 bg-[#fffdf7] px-4 py-3 text-base leading-7 text-[#5a4a3a]">
        {isEditing ? (
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            role="textbox"
            aria-label="محضر قابل للتعديل"
          >
            {item.text}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full text-right"
          >
            {highlight}
          </button>
        )}
      </div>
    </article>
  )
}
