import { type ReactNode, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, Zap, Database, Layout as LayoutIcon, Shield, BookOpen } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { API_FUNCTIONS } from '../../../data/api-functions.ts'
import { EVENTS } from '../../../data/events.ts'
import { DATA_TYPES } from '../../../data/data-types.ts'
import { WIDGETS } from '../../../data/widgets.ts'

const QUICK_STATS = [
  { label: 'API Functions', count: API_FUNCTIONS.length, icon: Code2, path: '/api' },
  { label: 'Events', count: EVENTS.length, icon: Zap, path: '/events' },
  { label: 'Widgets', count: WIDGETS.length, icon: LayoutIcon, path: '/widgets' },
  { label: 'Data Types', count: DATA_TYPES.length, icon: Database, path: '/data-types' },
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
      .map((f) => ({ type: 'api' as const, name: f.name, desc: f.description, protected: f.protected }))
    const events = EVENTS
      .filter((e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .slice(0, 6)
      .map((e) => ({ type: 'event' as const, name: e.name, desc: e.description, protected: false }))
    const widgets = WIDGETS
      .filter((w) => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((w) => ({ type: 'widget' as const, name: w.name, desc: w.description, protected: false }))
    return [...funcs, ...events, ...widgets]
  }, [searchQuery])

  const handleResultClick = useCallback((type: string, name: string) => {
    if (type === 'api') navigate(`/api/${name}`)
    else if (type === 'event') navigate(`/events/${name}`)
    else if (type === 'widget') navigate(`/widgets/${name}`)
  }, [navigate])

  const protectedCount = useMemo(
    () => API_FUNCTIONS.filter((f) => f.protected).length,
    [],
  )

  return (
    <Container>
      <Hero>
        <HeroIcon>
          <BookOpen size={40} color={theme.colors.primary} />
        </HeroIcon>
        <HeroTitle>MilkyWay Codex</HeroTitle>
        <HeroSubtitle>
          Complete API reference for World of Warcraft 3.3.5a (Build 12340)
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
                    {r.type === 'api' ? 'fn' : r.type === 'event' ? 'event' : 'widget'}
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
        <StatCard onClick={() => navigate('/api?filter=protected')}>
          <Shield size={24} color={theme.colors.protected} />
          <StatCount>{protectedCount}</StatCount>
          <StatLabel>Protected</StatLabel>
        </StatCard>
      </StatsGrid>

      <InfoSection>
        <InfoCard>
          <InfoTitle>About this Reference</InfoTitle>
          <InfoText>
            This documentation covers the complete Lua API available in the World of Warcraft 3.3.5a
            (WotLK) client. Functions, events, widgets, and data types have been extracted directly
            from the client binary (build 12340) and cross-referenced with historical documentation.
          </InfoText>
          <InfoText>
            <strong>Protected functions</strong> require a hardware event (mouse click, key press) to execute.
            They cannot be called programmatically from addon code without user interaction.
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
  background: ${(p) => p.$type === 'api' ? 'rgba(56, 189, 248, 0.1)' : p.$type === 'event' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(192, 132, 252, 0.1)'};
  color: ${(p) => p.$type === 'api' ? theme.colors.primary : p.$type === 'event' ? theme.colors.accent : theme.colors.luaType};
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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

  &:last-child {
    margin-bottom: 0;
  }
`
