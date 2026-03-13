import { useState, useCallback } from 'react'

interface UseCopyReturn {
  copied: boolean
  copy: (text: string) => void
}

export const useCopy = (timeout = 2000): UseCopyReturn => {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string): void => {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    },
    [timeout],
  )

  return { copied, copy }
}
