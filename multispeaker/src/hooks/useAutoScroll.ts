import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useAutoScroll(dependencies: Array<unknown> = []) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    container.scrollTop = container.scrollHeight
  }, [])

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom()
    }
  }, [autoScroll, scrollToBottom, ...dependencies])

  const onScroll = useMemo(() => {
    return () => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const threshold = 120
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight

      setAutoScroll(distanceFromBottom < threshold)
    }
  }, [])

  return { containerRef, autoScroll, setAutoScroll, onScroll, scrollToBottom }
}
