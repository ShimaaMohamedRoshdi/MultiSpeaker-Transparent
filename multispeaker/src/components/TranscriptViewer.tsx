import { useMemo } from 'react'
import type { TranscriptMessage as TranscriptMessageType } from '../types/transcript'
import { useAutoScroll } from '../hooks/useAutoScroll'
import TranscriptMessage from './TranscriptMessage'

interface TranscriptViewerProps {
  items: TranscriptMessageType[]
  query: string
  onEdit: (id: string, text: string) => void
}

export default function TranscriptViewer({ items, query, onEdit }: TranscriptViewerProps) {
  const lastItem = items[items.length - 1]
  const { containerRef, autoScroll, onScroll, scrollToBottom } = useAutoScroll([
    items.length,
    lastItem?.text,
    lastItem?.timestamp,
  ])

  const jumpLabel = useMemo(() => (autoScroll ? 'متابعة مباشرة' : 'الانتقال إلى الأحدث'), [autoScroll])

  return (
    <section className="flex h-full flex-col rounded-[34px] border border-amber-200 bg-[#fff7e5] shadow-[0_20px_45px_rgba(139,69,19,0.12)]">
      <div className="flex flex-col gap-4 border-b border-amber-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg text-[#5a4a3a]">محضر الجلسة المباشر</h2>
          <p className="text-sm text-[#a08c6d]">تغذية فورية مع إمكانية التعديل.</p>
        </div>
        <button
          type="button"
          onClick={scrollToBottom}
          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
            autoScroll
              ? 'border-emerald-300 text-emerald-700'
              : 'border-amber-200 text-[#8b7355] hover:border-amber-300'
          }`}
        >
          {jumpLabel}
        </button>
      </div>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 space-y-5 overflow-y-auto px-6 pb-6 pt-4 scrollbar-thin scrollbar-slate"
      >
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-200 bg-[#faf8f3] px-6 py-10 text-center text-sm text-[#a08c6d]">
            لا توجد رسائل بعد. في انتظار بدء الجلسة.
          </div>
        ) : (
          items.map((item) => (
            <TranscriptMessage key={item.id} item={item} query={query} onEdit={onEdit} />
          ))
        )}
      </div>
    </section>
  )
}
