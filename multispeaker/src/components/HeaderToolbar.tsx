import ConnectionStatus from './ConnectionStatus'
import SearchBar from './SearchBar'

export default function HeaderToolbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-amber-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl text-[#5a4a3a]">لوحة متابعة جلسة المحكمة</p>
          <p className="text-sm text-[#a08c6d]">متابعة فورية لمحضر الجلسة المباشر.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-amber-200 bg-[#faf8f3] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#8b7355]">
            مراقبة الجلسة المباشرة
          </div>
          <div className="hidden lg:block">
            <ConnectionStatus />
          </div>
        </div>
        <div className="w-full lg:w-80">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
