import { type ReactNode, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, Zap, Database, Layout as LayoutIcon, Shield, Terminal } from 'lucide-react'
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

const QUICK_STATS = [
  { label: 'Game Functions', count: API_FUNCTIONS.length, icon: Code2, path: '/api' },
  { label: 'Client Functions', count: WIDGETS.length, icon: LayoutIcon, path: '/widgets' },
  { label: 'Events', count: EVENTS.length, icon: Zap, path: '/events' },
  { label: 'Data Types', count: DATA_TYPES.length, icon: Database, path: '/data-types' },
  { label: 'Secure Templates', count: SECURE_TEMPLATES.length, icon: Shield, path: '/secure-templates' },
  { label: 'CVars', count: CVARS.length, icon: Terminal, path: '/cvars' },
] as const

const HomePage = (): ReactNode => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    const q = searchQuery.toLowerCase()
    const funcs = API_FUNCTIONS
      .filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
      .slice(0, 12)
      .map((f) => ({ type: 'api' as const, name: f.name, desc: f.description, protected: f.tags.includes('protected') }))
    const events = EVENTS
      .filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .slice(0, 6)
      .map((e) => ({ type: 'event' as const, name: e.name, desc: e.description, protected: false }))
    const widgets = WIDGETS
      .filter((w) => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((w) => ({ type: 'widget' as const, name: w.name, desc: w.description, protected: false }))
    const methods = WIDGETS.flatMap((w) =>
      w.methods
        .filter((m) => {
          const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
          return short.toLowerCase().includes(q)
        })
        .map((m) => {
          const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
          return { type: 'method' as const, name: `${w.name}:${short}`, desc: m.description, protected: false }
        }),
    ).slice(0, 6)
    const dataTypes = DATA_TYPES
      .filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((t) => ({ type: 'datatype' as const, name: t.name, desc: t.description, protected: false }))
    const cvars = CVARS
      .filter((c) => `${c.name} ${c.description} ${c.category}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({ type: 'cvar' as const, name: c.name, desc: c.description, protected: false }))
    const secureTemplates = SECURE_TEMPLATES
      .filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((s) => ({ type: 'secure' as const, name: s.name, desc: s.description, protected: false }))
    return [...funcs, ...events, ...widgets, ...methods, ...dataTypes, ...cvars, ...secureTemplates]
  }, [searchQuery])

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
  }, [navigate])

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
        <SearchContainer>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search functions, events, types... (press /)"
            resultCount={searchQuery.length >= 2 ? searchResults.length : undefined}
          />
          {searchResults.length > 0 && (
            <ResultsDropdown>
              {searchResults.map((r) => (
                <ResultItem
                  key={`${r.type}-${r.name}`}
                  onClick={() => handleResultClick(r.type, r.name)}
                >
                  <ResultType $type={r.type}>
                    {r.type === 'api' ? 'fn' : r.type === 'event' ? 'event' : r.type === 'widget' || r.type === 'method' ? 'widget' : r.type === 'datatype' ? 'type' : r.type === 'cvar' ? 'cvar' : 'template'}
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
            Most of the data was assembled by scraping archived versions of WoWWiki, Wowpedia,
            and other community resources — using pre-Cataclysm snapshots from the Wayback Machine
            to ensure accuracy for the 3.3.5a client. Descriptions, event payloads, usage notes,
            and function signatures were all recovered from these archives.
            Where the community documentation was incomplete, the client binary (build 12340) was
            reverse-engineered to extract additional function signatures, widget methods, CVar
            definitions, and internal structures that were never publicly documented.
            Every entry is then reconciled across these sources to provide the most complete
            3.3.5a reference available today.
          </InfoText>
          <InfoText>
            This is a community-driven project — if you spot an error, a missing function, or
            want to improve a description, contributions are very welcome on{' '}
            <a href="https://github.com/Shard-MW/milkyway-codex" target="_blank" rel="noopener noreferrer">GitHub</a>.
            Whether it's fixing a typo or adding undocumented API details, every contribution helps
            make this reference better for the whole 3.3.5a modding community.
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
`

const HeroIcon = styled.div`
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: 36px;
  letter-spacing: 2px;
  margin-bottom: 8px;
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

const ResultItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
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
