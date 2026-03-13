import { useState, useMemo, useCallback } from 'react'
import type { SearchResult } from '../types/api.types.ts'

interface UseSearchOptions<T> {
  items: T[]
  getSearchableText: (item: T) => string
  getResult: (item: T) => SearchResult
}

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  resultCount: number
}

export const useSearch = <T>({
  items,
  getSearchableText,
  getResult,
}: UseSearchOptions<T>): UseSearchReturn => {
  const [query, setQuery] = useState('')

  const searchIndex = useMemo(() => {
    return items.map((item) => ({
      text: getSearchableText(item).toLowerCase(),
      item,
    }))
  }, [items, getSearchableText])

  const results = useMemo(() => {
    if (query.length === 0) return items.map(getResult)

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return searchIndex
      .filter(({ text }) => terms.every((term) => text.includes(term)))
      .map(({ item }) => getResult(item))
  }, [query, searchIndex, items, getResult])

  const handleSetQuery = useCallback((value: string) => {
    setQuery(value)
  }, [])

  return {
    query,
    setQuery: handleSetQuery,
    results,
    resultCount: results.length,
  }
}
