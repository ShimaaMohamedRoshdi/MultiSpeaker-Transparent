import type { TranscriptMessage } from '../types/transcript'
import TranscriptMessageCard from './TranscriptMessage'

interface TranscriptItemProps {
  item: TranscriptMessage
  query: string
  onEdit: (id: string, text: string) => void
}

export default function TranscriptItem({ item, query, onEdit }: TranscriptItemProps) {
  return <TranscriptMessageCard item={item} query={query} onEdit={onEdit} />
}
