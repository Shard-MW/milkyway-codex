import { type ReactNode, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
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
import { WIDGETS } from '../../../data/widgets.ts'
import type { Widget } from '../../../types/api.types.ts'

const ROW_HEIGHT = 60

const CATEGORY_LABELS: Record<Widget['category'], string> = {
  frame: 'Frames',
  region: 'Regions',
  animation: 'Animations',
  abstract: 'Abstract',
}

const CATEGORIES = ['all', 'frame', 'region', 'animation', 'abstract'] as const

const WidgetsPage = (): ReactNode => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') ?? 'all')
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
    let items = WIDGETS

    if (activeCategory !== 'all') {
      items = items.filter((w) => w.category === activeCategory)
    }

    if (query.length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      items = items.filter((w) => {
        const text = `${w.name} ${w.description} ${w.inherits.join(' ')}`.toLowerCase()
        return terms.every((t) => text.includes(t))
      })
    }

    return items
  }, [query, activeCategory])

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

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const w = filtered[index]
      return (
        <Row style={style} onClick={() => navigate(`/widgets/${w.name}`)} key={w.name}>
          <WidgetName>{w.name}</WidgetName>
          <WidgetMeta>
            <MethodCount>{w.methods.length} methods</MethodCount>
            {w.inherits.length > 0 && (
              <InheritInfo>: {w.inherits.slice(0, 3).join(', ')}{w.inherits.length > 3 ? ` +${w.inherits.length - 3}` : ''}</InheritInfo>
            )}
          </WidgetMeta>
          <WidgetDesc>{w.description}</WidgetDesc>
          <CategoryBadge $category={w.category}>
            {CATEGORY_LABELS[w.category]}
          </CategoryBadge>
        </Row>
      )
    },
    [filtered, navigate],
  )

  return (
    <ListPageContainer>
      <ListHeader>
        <ListTitle>Widgets</ListTitle>
        <ListCount>{filtered.length} widget types</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search widgets by name or description..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <Filters>
        <FilterGroup>
          {CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              $active={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as Widget['category']]}
            </FilterButton>
          ))}
        </FilterGroup>
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

export default WidgetsPage

const WidgetName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 14px;
  color: ${theme.colors.luaType};
  min-width: 200px;
  white-space: nowrap;
`

const WidgetMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 180px;
  white-space: nowrap;
`

const MethodCount = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.primary};
`

const InheritInfo = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  opacity: 0.6;
`

const WidgetDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`

const CategoryBadge = styled.span<{ $category: string }>`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  white-space: nowrap;
  background: ${(p) => {
    switch (p.$category) {
      case 'frame': return 'rgba(56, 189, 248, 0.1)'
      case 'region': return 'rgba(134, 239, 172, 0.1)'
      case 'animation': return 'rgba(245, 158, 11, 0.1)'
      case 'abstract': return 'rgba(148, 163, 184, 0.1)'
      default: return 'transparent'
    }
  }};
  color: ${(p) => {
    switch (p.$category) {
      case 'frame': return theme.colors.primary
      case 'region': return theme.colors.returnType
      case 'animation': return theme.colors.accent
      case 'abstract': return theme.colors.textMuted
      default: return theme.colors.textMuted
    }
  }};
`
