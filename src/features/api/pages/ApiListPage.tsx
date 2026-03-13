import { type ReactNode, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { Tag, getTagVariant } from '../../../components/shared/Tag.tsx'
import {
  ListPageContainer,
  ListHeader,
  ListTitle,
  ListCount,
  Filters,
  FilterGroup,
  FilterButton,
  ListContainer,
  Row,
} from '../../../components/shared/ListPage.tsx'
import { API_FUNCTIONS } from '../../../data/api-functions.ts'
import { API_CATEGORIES } from '../../../data/categories.ts'

const ROW_HEIGHT = 52

const ALL_FLAGS = [
  'protected', 'nocombat', 'hardware', 'blizzardui', 'framexml',
  'deprecated', 'internal', 'luaapi', 'maconly', 'confirmation',
  'server', 'review',
] as const

const ApiListPage = (): ReactNode => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? 'all')
  const [activeFlags, setActiveFlags] = useState<Set<string>>(() => {
    const flags = searchParams.get('flags')
    return flags ? new Set(flags.split(',')) : new Set()
  })
  const [showFlagPanel, setShowFlagPanel] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [listHeight, setListHeight] = useState(600)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setListHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => {
    let items = API_FUNCTIONS

    if (activeFlags.size > 0) {
      items = items.filter((f) => {
        for (const flag of activeFlags) {
          if (!f.tags.includes(flag)) return false
        }
        return true
      })
    }

    if (activeCategory !== 'all') {
      items = items.filter((f) => f.category === activeCategory)
    }

    if (query.length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      items = items.filter((f) => {
        const text = `${f.name} ${f.description} ${f.tags.join(' ')}`.toLowerCase()
        return terms.every((t) => text.includes(t))
      })
    }

    return items
  }, [query, activeCategory, activeFlags])

  const handleCategoryChange = useCallback(
    (cat: string) => {
      setActiveCategory(cat)
      const params = new URLSearchParams(searchParams)
      if (cat === 'all') params.delete('category')
      else params.set('category', cat)
      setSearchParams(params)
    },
    [searchParams, setSearchParams],
  )

  const handleFlagToggle = useCallback(
    (flag: string) => {
      setActiveFlags((prev) => {
        const next = new Set(prev)
        if (next.has(flag)) next.delete(flag)
        else next.add(flag)
        const params = new URLSearchParams(searchParams)
        if (next.size > 0) params.set('flags', [...next].join(','))
        else params.delete('flags')
        setSearchParams(params)
        return next
      })
    },
    [searchParams, setSearchParams],
  )

  const clearFlags = useCallback(() => {
    setActiveFlags(new Set())
    const params = new URLSearchParams(searchParams)
    params.delete('flags')
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const fn = filtered[index]
      return (
        <Row style={style} onClick={() => navigate(`/api/${fn.name}`)} key={fn.name}>
          <FnName>{fn.name}</FnName>
          <FnBadges>
            {fn.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </FnBadges>
          <FnDesc>{fn.description}</FnDesc>
          <CategoryBadge>{fn.category.replace(/ functions$/i, '').replace(/ actions$/i, '')}</CategoryBadge>
        </Row>
      )
    },
    [filtered, navigate],
  )

  return (
    <ListPageContainer>
      <ListHeader>
        <ListTitle>Game Functions</ListTitle>
        <ListCount>{filtered.length.toLocaleString()} functions</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search functions by name, description, or tag..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <Filters>
        <CategorySelect
          value={activeCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {API_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/ functions$/i, '').replace(/ actions$/i, '')}
            </option>
          ))}
        </CategorySelect>
        <DesktopFilterGroup>
          <FilterButton
            $active={activeCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </FilterButton>
          {API_CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              $active={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.replace(/ functions$/i, '').replace(/ actions$/i, '')}
            </FilterButton>
          ))}
        </DesktopFilterGroup>
        <FlagToggleButton
          $active={showFlagPanel || activeFlags.size > 0}
          onClick={() => setShowFlagPanel((p) => !p)}
        >
          <Filter size={14} />
          Flags
          {activeFlags.size > 0 && <FlagCount>{activeFlags.size}</FlagCount>}
        </FlagToggleButton>
      </Filters>

      {showFlagPanel && (
        <FlagPanel>
          <FlagChips>
            {ALL_FLAGS.map((flag) => (
              <FlagChip
                key={flag}
                $active={activeFlags.has(flag)}
                $variant={getTagVariant(flag)}
                onClick={() => handleFlagToggle(flag)}
              >
                {flag}
              </FlagChip>
            ))}
          </FlagChips>
          {activeFlags.size > 0 && (
            <ClearFlags onClick={clearFlags}>Clear all</ClearFlags>
          )}
        </FlagPanel>
      )}

      <ListContainer ref={listRef}>
        <FixedSizeList
          height={listHeight}
          width="100%"
          itemCount={filtered.length}
          itemSize={ROW_HEIGHT}
          overscanCount={20}
        >
          {renderRow}
        </FixedSizeList>
      </ListContainer>
    </ListPageContainer>
  )
}

export default ApiListPage

const CategorySelect = styled.select`
  display: none;
  font-family: ${theme.fonts.code};
  font-size: 12px;
  padding: 6px 10px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.bgInput};
  color: ${theme.colors.textBright};
  flex: 1;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: block;
  }
`

const DesktopFilterGroup = styled(FilterGroup)`
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const FlagToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${(p) => (p.$active ? theme.colors.accent : theme.colors.border)};
  background: ${(p) => (p.$active ? theme.colors.bgElevated : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.textBright : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.borderLight};
    color: ${theme.colors.textBright};
  }
`

const FlagCount = styled.span`
  font-size: 10px;
  background: ${theme.colors.accent};
  color: ${theme.colors.bg};
  border-radius: 10px;
  padding: 0 6px;
  font-weight: 700;
`

const FlagPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 10px;
  }
`

const FlagChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const FlagChip = styled.button<{ $active: boolean; $variant: string }>`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 3px 10px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${(p) => (p.$active ? theme.colors.borderLight : theme.colors.border)};
  background: ${(p) => (p.$active ? theme.colors.bgElevated : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.textBright : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: ${(p) => (p.$active ? 1 : 0.7)};

  &:hover {
    opacity: 1;
    border-color: ${theme.colors.borderLight};
  }
`

const ClearFlags = styled.button`
  font-family: ${theme.fonts.body};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: underline;
  text-decoration-style: dotted;

  &:hover {
    color: ${theme.colors.textBright};
  }
`

const FnName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.primary};
  min-width: 240px;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const FnBadges = styled.div`
  display: flex;
  gap: 4px;
  min-width: 120px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const FnDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const CategoryBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  white-space: nowrap;
  background: rgba(56, 189, 248, 0.1);
  color: ${theme.colors.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`
