import { type ReactNode, useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, Zap, Database, Layout as LayoutIcon, Terminal, Swords, Table } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { CodexIcon } from '../../../components/shared/CodexIcon.tsx'
import { API_FUNCTIONS } from '../../../data/api-functions.ts'
import { EVENTS } from '../../../data/events.ts'
import { DATA_TYPES } from '../../../data/data-types.ts'
import { WIDGETS } from '../../../data/widgets.ts'
import { CVARS } from '../../../data/cvars.ts'
import { SECURE_TEMPLATES } from '../../../data/secure-templates.ts'
import { COMBAT_LOG_SUB_EVENTS } from '../../../data/combat-log-events.ts'
import { DBCS } from '../../../data/dbcs.ts'

const WIDGET_METHOD_COUNT = WIDGETS.reduce((sum, w) => sum + w.methods.length, 0)

const QUICK_STATS = [
  { label: 'Game Functions', count: API_FUNCTIONS.length, icon: Code2, path: '/api' },
  { label: 'Client Functions', count: WIDGET_METHOD_COUNT, icon: LayoutIcon, path: '/widgets' },
  { label: 'Events', count: EVENTS.length, icon: Zap, path: '/events' },
  { label: 'Combat Log', count: COMBAT_LOG_SUB_EVENTS.length, icon: Swords, path: '/combat-log' },
  { label: 'Data Types', count: DATA_TYPES.length, icon: Database, path: '/data-types' },
  { label: 'DBCs', count: DBCS.length, icon: Table, path: '/dbcs' },
  { label: 'CVars', count: CVARS.length, icon: Terminal, path: '/cvars' },
] as const

const HomePage = (): ReactNode => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase()
    const terms = q.split(/[\s.\\/]+/).filter(Boolean)
    const matchAll = (text: string): boolean => {
      const t = text.toLowerCase()
      return terms.every((term) => t.includes(term))
    }
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
  }, [searchQuery])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchResults])

  const handleResultClick = useCallback((type: string, name: string) => {
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
  }, [navigate])

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault()
      const r = searchResults[selectedIndex]
      if (r) handleResultClick(r.type, r.name)
    }
  }, [searchResults, selectedIndex, handleResultClick])

  return (
    <Container>
      <Hero>
        <HeroIcon>
          <CodexIcon size={40} />
        </HeroIcon>
        <HeroTitle>MilkyWay Codex</HeroTitle>
        <HeroSubtitle>
          Open-source API reference for WoW 3.3.5a modding (Build 12340)
        </HeroSubtitle>
        <SearchContainer onKeyDown={handleSearchKeyDown}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search functions, events, types..."
            resultCount={searchQuery.length >= 2 ? searchResults.length : undefined}
          />
          {searchResults.length > 0 && (
            <ResultsDropdown>
              {searchResults.map((r, i) => (
                <ResultItem
                  key={`${r.type}-${r.name}`}
                  $selected={i === selectedIndex}
                  onClick={() => handleResultClick(r.type, r.name)}
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
            </ResultsDropdown>
          )}
        </SearchContainer>
      </Hero>

      <StatsGrid>
        {QUICK_STATS.map(({ label, count, icon: Icon, path }) => (
          <StatCard key={label} onClick={() => navigate(path)}>
            <Icon size={24} color={theme.colors.primary} />
            <StatCount>{count.toLocaleString()}</StatCount>
            <StatLabel>{label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <InfoSection>
        <InfoCard>
          <InfoTitle>About this Reference</InfoTitle>
          <InfoText>
            MilkyWay Codex is an open-source reference built for the WoW 3.3.5a (WotLK) modding community.
            It documents the Lua API, UI widgets, game events, data types, console variables, and secure
            templates available in the client.
          </InfoText>
          <InfoText>
            The primary source is the <em>World of Warcraft Programming</em> book (2nd Edition), the
            definitive WotLK 3.3.5a reference. This was supplemented by scraping pre-Cataclysm
            snapshots of WoWProgramming.com from the Wayback Machine. Where documentation was
            incomplete, the client binary (build 12340) was reverse-engineered to extract function
            signatures, widget methods, CVar definitions, and internal structures that were never
            publicly documented. Every entry is reconciled across these sources to provide the most
            complete 3.3.5a reference available today.
          </InfoText>
          <InfoText>
            This is a community-driven project — if you spot an error, a missing function, or
            want to improve a description, contributions are very welcome on{' '}
            <a href="https://github.com/Shard-MW/milkyway-codex" target="_blank" rel="noopener noreferrer">GitHub</a>.
            Check the <a href="/contribute">Contribute</a> page to see which entries still need
            documentation or verification.
          </InfoText>
        </InfoCard>
      </InfoSection>
    </Container>
  )
}

export default HomePage

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

const Hero = styled.div`
  text-align: center;
  padding: 48px 0 32px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 24px 0 20px;
  }
`

const HeroIcon = styled.div`
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: 36px;
  letter-spacing: 2px;
  margin-bottom: 8px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 26px;
  }
`

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.textMuted};
  margin-bottom: 32px;
`

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`

const ResultItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: ${(p) => p.$selected ? theme.colors.bgElevated : 'none'};
  border: none;
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`

const ResultType = styled.span<{ $type: string }>`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
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
`

const ProtectedBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 9px;
  padding: 1px 5px;
  border-radius: ${theme.radius.sm};
  background: rgba(239, 68, 68, 0.1);
  color: ${theme.colors.protected};
  border: 1px solid rgba(239, 68, 68, 0.3);
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 32px 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin: 20px 0;
  }
`

const StatCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  cursor: pointer;
  transition: all 0.15s ease;
  color: inherit;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.bgElevated};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 14px 10px;
    gap: 6px;
  }
`

const StatCount = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 24px;
  color: ${theme.colors.textBright};
`

const StatLabel = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

const InfoSection = styled.div`
  margin-top: 24px;
`

const InfoCard = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: 24px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px;
  }
`

const InfoTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 12px;
`

const InfoText = styled.p`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  line-height: 1.6;
  margin-bottom: 8px;

  strong {
    color: ${theme.colors.text};
  }

  a {
    color: ${theme.colors.primary};

    &:hover {
      text-decoration: underline;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`
