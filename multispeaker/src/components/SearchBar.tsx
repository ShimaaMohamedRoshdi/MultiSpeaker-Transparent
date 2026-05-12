import { useTranscriptStore } from '../store/transcriptStore'

export default function SearchBar() {
  const searchQuery = useTranscriptStore((state) => state.searchQuery)
  const setSearchQuery = useTranscriptStore((state) => state.setSearchQuery)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.3em] text-[#a08c6d]">
        بحث في المحضر
      </label>
      <input
        type="search"
        placeholder="ابحث عن متحدث أو عبارة"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-[#5a4a3a] placeholder:text-[#a08c6d] focus:border-amber-400 focus:outline-none"
      />
    </div>
  )
}
