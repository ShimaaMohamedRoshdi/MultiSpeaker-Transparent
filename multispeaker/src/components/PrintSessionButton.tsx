interface PrintSessionButtonProps {
  className?: string
}

export default function PrintSessionButton({ className }: PrintSessionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={className}
    >
      طباعة الجلسة
    </button>
  )
}
