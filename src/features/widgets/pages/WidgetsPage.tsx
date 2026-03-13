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

const ROW_HEIGHT = 52

const CATEGORY_LABELS: Record<Widget['category'], string> = {
  frame: 'Frames',
  region: 'Regions',
  animation: 'Animations',
  abstract: 'Abstract',
}

const CATEGORIES = ['all', 'frame', 'region', 'animation', 'abstract'] as const

type WidgetRow = { kind: 'widget'; widget: Widget }
type MethodRow = { kind: 'method'; widgetName: string; methodName: string; description: string; category: Widget['category'] }
type ResultRow = WidgetRow | MethodRow

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

  const rows = useMemo((): ResultRow[] => {
    let items = WIDGETS

    if (activeCategory !== 'all') {
      items = items.filter((w) => w.category === activeCategory)
    }

    if (query.length === 0) {
      return items.map((w) => ({ kind: 'widget', widget: w }))
    }

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    const results: ResultRow[] = []

    for (const w of items) {
      const widgetText = `${w.name} ${w.description} ${w.inherits.join(' ')}`.toLowerCase()
      const widgetMatches = terms.every((t) => widgetText.includes(t))

      if (widgetMatches) {
        results.push({ kind: 'widget', widget: w })
      }

      // Search methods individually
      for (const m of w.methods) {
        const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
        const methodText = `${short} ${m.description}`.toLowerCase()
        if (terms.every((t) => methodText.includes(t))) {
          results.push({ kind: 'method', widgetName: w.name, methodName: short, description: m.description, category: w.category })
        }
      }
    }

    return results
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
      const row = rows[index]
      if (row.kind === 'widget') {
        const w = row.widget
        return (
          <Row style={style} onClick={() => navigate(`/widgets/${w.name}`)} key={`w-${w.name}`}>
            <WidgetName>{w.name}</WidgetName>
            <WidgetMeta>
              <MethodCountBadge>{w.methods.length} methods</MethodCountBadge>
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
      }

      return (
        <Row style={style} onClick={() => navigate(`/widgets/${row.widgetName}#${row.methodName}`)} key={`m-${row.widgetName}-${row.methodName}`}>
          <WidgetName>
            <MethodWidget>{row.widgetName}</MethodWidget>:<MethodShort>{row.methodName}</MethodShort>
          </WidgetName>
          <WidgetMeta>
            <MethodBadge>method</MethodBadge>
          </WidgetMeta>
          <WidgetDesc>{row.description}</WidgetDesc>
          <CategoryBadge $category={row.category}>
            {CATEGORY_LABELS[row.category]}
          </CategoryBadge>
        </Row>
      )
    },
    [rows, navigate],
  )

  return (
    <ListPageContainer>
      <ListHeader>
        <ListTitle>Client Functions</ListTitle>
        <ListCount>{rows.length} results</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search widgets, methods..."
        resultCount={query.length > 0 ? rows.length : undefined}
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
          itemCount={rows.length}
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
  font-size: 13px;
  color: ${theme.colors.luaType};
  min-width: 240px;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 0;
    flex: 1;
  }
`

const MethodWidget = styled.span`
  color: ${theme.colors.textMuted};
`

const MethodShort = styled.span`
  color: ${theme.colors.textBright};
`

const WidgetMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 160px;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const MethodCountBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  background: rgba(56, 189, 248, 0.08);
  color: ${theme.colors.primary};
`

const MethodBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  background: rgba(192, 132, 252, 0.08);
  color: ${theme.colors.luaType};
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
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
