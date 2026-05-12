import type { ReactNode } from 'react'

export function highlightText(text: string, query: string): ReactNode {
  if (!query) {
    return text
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const parts: ReactNode[] = []
  let index = 0

  while (index < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, index)
    if (matchIndex === -1) {
      parts.push(text.slice(index))
      break
    }

    if (matchIndex > index) {
      parts.push(text.slice(index, matchIndex))
    }

    parts.push(
      <mark key={`${matchIndex}-${lowerQuery}`}>{
        text.slice(matchIndex, matchIndex + lowerQuery.length)
      }</mark>,
    )
    index = matchIndex + lowerQuery.length
  }

  return parts
}
