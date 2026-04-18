import { type ReactNode, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { API_FUNCTIONS } from '../../data/api-functions.ts'
import { EVENTS } from '../../data/events.ts'
import { WIDGETS } from '../../data/widgets.ts'
import { DATA_TYPES } from '../../data/data-types.ts'
import { CVARS } from '../../data/cvars.ts'
import { SECURE_TEMPLATES } from '../../data/secure-templates.ts'
import { DBCS } from '../../data/dbcs.ts'

interface SearchResult {
  type: 'api' | 'event' | 'widget' | 'method' | 'datatype' | 'cvar' | 'secure' | 'dbc'
  name: string
  desc: string
  protected: boolean
}

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export const GlobalSearch = ({ open, onClose }: GlobalSearchProps): ReactNode => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // Small delay to ensure the overlay is rendered before focusing
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const results = useMemo((): SearchResult[] => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    // Term-based match: split on whitespace / dots / slashes so "spell dbc" matches "Spell.dbc"
    const terms = q.split(/[\s.\\/]+/).filter(Boolean)
    const matchAll = (text: string): boolean => {
      const t = text.toLowerCase()
      return terms.every((term) => t.includes(term))
    }
    // Relevance rank on name: exact > starts-with > terms-exact > contains.
    //   Used both to pre-rank within a category (so the most relevant N survive
    //   the slice) and to globally re-rank across categories at the end.
    const nameRank = (name: string): number => {
      const n = name.toLowerCase()
      if (n === q) return 0
      if (n.startsWith(q)) return 1
      if (terms.some((t) => n === t)) return 2
      return 3
    }
    const sortByRank = <T extends { name: string }>(arr: T[]): T[] =>
      arr
        .map((x, i) => ({ x, i, r: nameRank(x.name) }))
        .sort((a, b) => a.r - b.r || a.i - b.i)
        .map((e) => e.x)

    const funcs = sortByRank(API_FUNCTIONS.filter((f) => matchAll(`${f.name} ${f.description}`)))
      .slice(0, 12)
      .map((f) => ({ type: 'api' as const, name: f.name, desc: f.description, protected: f.tags.includes('protected') }))
    const events = sortByRank(EVENTS.filter((e) => matchAll(`${e.name} ${e.description}`)))
      .slice(0, 6)
      .map((e) => ({ type: 'event' as const, name: e.name, desc: e.description, protected: false }))
    const widgets = sortByRank(WIDGETS.filter((w) => matchAll(`${w.name} ${w.description}`)))
      .slice(0, 4)
      .map((w) => ({ type: 'widget' as const, name: w.name, desc: w.description, protected: false }))
    const methods = sortByRank(
      WIDGETS.flatMap((w) =>
        w.methods
          .filter((m) => {
            const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
            return matchAll(short)
          })
          .map((m) => {
            const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
            return { name: `${w.name}:${short}`, desc: m.description }
          }),
      ),
    )
      .slice(0, 6)
      .map((m) => ({ type: 'method' as const, name: m.name, desc: m.desc, protected: false }))
    const dataTypes = sortByRank(DATA_TYPES.filter((t) => matchAll(`${t.name} ${t.description}`)))
      .slice(0, 4)
      .map((t) => ({ type: 'datatype' as const, name: t.name, desc: t.description, protected: false }))
    const cvars = sortByRank(CVARS.filter((c) => matchAll(`${c.name} ${c.description} ${c.category}`)))
      .slice(0, 4)
      .map((c) => ({ type: 'cvar' as const, name: c.name, desc: c.description, protected: false }))
    const secureTemplates = sortByRank(SECURE_TEMPLATES.filter((s) => matchAll(`${s.name} ${s.description}`)))
      .slice(0, 4)
      .map((s) => ({ type: 'secure' as const, name: s.name, desc: s.description, protected: false }))
    const dbcs = sortByRank(DBCS.filter((d) => matchAll(`${d.name} ${d.filename} ${d.description}`)))
      .slice(0, 8)
      .map((d) => ({ type: 'dbc' as const, name: d.name, desc: d.description || d.filename, protected: false }))

    const merged = [...funcs, ...events, ...widgets, ...methods, ...dataTypes, ...cvars, ...secureTemplates, ...dbcs]
    return merged
      .map((r, i) => ({ r, i, rank: nameRank(r.name) }))
      .sort((a, b) => a.rank - b.rank || a.i - b.i)
      .map((e) => e.r)
  }, [query])

  const navigateTo = useCallback((type: string, name: string) => {
    if (type === 'api') navigate(`/api/${name}`)
    else if (type === 'event') navigate(`/events/${name}`)
    else if (type === 'widget') navigate(`/widgets/${name}`)
    else if (type === 'method') {
      const [widget, method] = name.split(':')
      navigate(`/widgets/${widget}#${method}`)
    }
    else if (type === 'datatype') navigate(`/data-types#${name}`)
    else if (type === 'cvar') navigate(`/cvars`)
    else if (type === 'secure') navigate(`/secure-templates#${name}`)
    else if (type === 'dbc') navigate(`/dbcs/${name}`)
    onClose()
  }, [navigate, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      const r = results[selectedIndex]
      if (r) navigateTo(r.type, r.name)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [results, selectedIndex, navigateTo, onClose])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  if (!open) return null

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <SearchRow>
          <SearchIcon size={20} />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search functions, events, widgets, types..."
            spellCheck={false}
          />
          {query.length > 0 && (
            <ClearButton onClick={() => setQuery('')} aria-label="Clear">
              <X size={16} />
            </ClearButton>
          )}
          <EscHint>esc</EscHint>
        </SearchRow>
        {results.length > 0 && (
          <ResultsList>
            {results.map((r, i) => (
              <ResultItem
                key={`${r.type}-${r.name}`}
                $selected={i === selectedIndex}
                onClick={() => navigateTo(r.type, r.name)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <ResultType $type={r.type}>
                  {r.type === 'api' ? 'fn' : r.type === 'event' ? 'event' : r.type === 'widget' || r.type === 'method' ? 'widget' : r.type === 'datatype' ? 'type' : r.type === 'cvar' ? 'cvar' : r.type === 'dbc' ? 'dbc' : 'template'}
                </ResultType>
                <ResultName>{r.name}</ResultName>
                {r.protected && <ProtectedBadge>Protected</ProtectedBadge>}
                <ResultDesc>{r.desc}</ResultDesc>
              </ResultItem>
            ))}
          </ResultsList>
        )}
        {query.length >= 2 && results.length === 0 && (
          <NoResults>No results found</NoResults>
        )}
      </Dialog>
    </Overlay>
  )
}

// Styled components at bottom
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  justify-content: center;
  padding-top: 15vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-top: 10vh;
  }
`

const Dialog = styled.div`
  width: 640px;
  max-width: calc(100vw - 32px);
  max-height: 60vh;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-self: flex-start;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${theme.colors.border};
  gap: 10px;
`

const SearchIcon = styled(Search)`
  color: ${theme.colors.textMuted};
  flex-shrink: 0;
`

const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  outline: none;
  color: ${theme.colors.textBright};
  font-size: 16px;
  font-family: ${theme.fonts.body};

  &::placeholder {
    color: ${theme.colors.textMuted};
    opacity: 0.6;
  }
`

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  border-radius: ${theme.radius.sm};

  &:hover {
    color: ${theme.colors.textBright};
  }
`

const EscHint = styled.kbd`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.bgElevated};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 2px 6px;
  opacity: 0.6;
  flex-shrink: 0;
`

const ResultsList = styled.div`
  overflow-y: auto;
  padding: 4px 0;
`

const ResultItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  background: ${(p) => p.$selected ? theme.colors.bgElevated : 'none'};
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`

const ResultType = styled.span<{ $type: string }>`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
  flex-shrink: 0;
  background: ${(p) => {
    switch (p.$type) {
      case 'api': return 'rgba(56, 189, 248, 0.1)'
      case 'event': return 'rgba(245, 158, 11, 0.1)'
      case 'widget': case 'method': return 'rgba(192, 132, 252, 0.1)'
      case 'datatype': return 'rgba(134, 239, 172, 0.1)'
      case 'cvar': return 'rgba(148, 163, 184, 0.1)'
      case 'dbc': return 'rgba(251, 191, 36, 0.12)'
      default: return 'rgba(248, 113, 113, 0.1)'
    }
  }};
  color: ${(p) => {
    switch (p.$type) {
      case 'api': return theme.colors.primary
      case 'event': return theme.colors.accent
      case 'widget': case 'method': return theme.colors.luaType
      case 'datatype': return theme.colors.returnType
      case 'cvar': return theme.colors.textMuted
      case 'dbc': return theme.colors.textGold
      default: return theme.colors.protected
    }
  }};
  white-space: nowrap;
`

const ResultName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright};
  white-space: nowrap;
  flex-shrink: 0;
`

const ProtectedBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 9px;
  padding: 1px 5px;
  border-radius: ${theme.radius.sm};
  background: rgba(239, 68, 68, 0.1);
  color: ${theme.colors.protected};
  border: 1px solid rgba(239, 68, 68, 0.3);
  flex-shrink: 0;
`

const ResultDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`

const NoResults = styled.div`
  padding: 24px 16px;
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.textMuted};
`
