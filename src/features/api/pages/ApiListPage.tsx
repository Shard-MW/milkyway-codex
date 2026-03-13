import { type ReactNode, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { Tag } from '../../../components/shared/Tag.tsx'
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

const ApiListPage = (): ReactNode => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? 'all')
  const [showProtectedOnly, setShowProtectedOnly] = useState(searchParams.get('filter') === 'protected')
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

    if (showProtectedOnly) {
      items = items.filter((f) => f.protected)
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
  }, [query, activeCategory, showProtectedOnly])

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

  const handleProtectedToggle = useCallback(() => {
    setShowProtectedOnly((prev) => {
      const next = !prev
      const params = new URLSearchParams(searchParams)
      if (next) params.set('filter', 'protected')
      else params.delete('filter')
      setSearchParams(params)
      return next
    })
  }, [searchParams, setSearchParams])

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const fn = filtered[index]
      return (
        <Row style={style} onClick={() => navigate(`/api/${fn.name}`)} key={fn.name}>
          <FnName>{fn.name}</FnName>
          <FnBadges>
            {fn.protected && (
              <Tag label="Protected" variant="protected" />
            )}
            {fn.hwEvent && (
              <Tag label="HW Event" variant="hwEvent" />
            )}
          </FnBadges>
          <FnDesc>{fn.description}</FnDesc>
          <FnCategory>{fn.category}</FnCategory>
        </Row>
      )
    },
    [filtered, navigate],
  )

  return (
    <ListPageContainer>
      <ListHeader>
        <ListTitle>API Functions</ListTitle>
        <ListCount>{filtered.length.toLocaleString()} functions</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search functions by name, description, or tag..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <Filters>
        <FilterGroup>
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
              {cat}
            </FilterButton>
          ))}
        </FilterGroup>
        <ToggleButton $active={showProtectedOnly} onClick={handleProtectedToggle}>
          <Shield size={14} />
          Protected only
        </ToggleButton>
      </Filters>

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

const ToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${(p) => (p.$active ? theme.colors.protected : theme.colors.border)};
  background: ${(p) => (p.$active ? 'rgba(239, 68, 68, 0.1)' : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.protected : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.protected};
    color: ${theme.colors.protected};
  }
`

const FnName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.primary};
  min-width: 240px;
  white-space: nowrap;
`

const FnBadges = styled.div`
  display: flex;
  gap: 4px;
  min-width: 120px;
`

const FnDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`

const FnCategory = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  opacity: 0.6;
  white-space: nowrap;
`
