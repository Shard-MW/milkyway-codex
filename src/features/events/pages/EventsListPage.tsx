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
import { EVENTS } from '../../../data/events.ts'

const ROW_HEIGHT = 52

const EVENT_CATEGORIES = [...new Set(EVENTS.map((e) => e.category))].sort()

const EventsListPage = (): ReactNode => {
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
    let items = EVENTS

    if (activeCategory !== 'all') {
      items = items.filter((e) => e.category === activeCategory)
    }

    if (query.length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      items = items.filter((e) => {
        const text = `${e.name} ${e.description} ${e.category}`.toLowerCase()
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
      const evt = filtered[index]
      return (
        <Row style={style} onClick={() => navigate(`/events/${evt.name}`)} key={evt.name}>
          <EvtName>{evt.name}</EvtName>
          <EvtDesc>{evt.description}</EvtDesc>
          <EvtCategory>{evt.category}</EvtCategory>
        </Row>
      )
    },
    [filtered, navigate],
  )

  return (
    <ListPageContainer>
      <ListHeader>
        <ListTitle>Events</ListTitle>
        <ListCount>{filtered.length.toLocaleString()} events</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search events by name or description..."
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
          {EVENT_CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              $active={activeCategory === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
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

export default EventsListPage

const EvtName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.accent};
  min-width: 280px;
  white-space: nowrap;
`

const EvtDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`

const EvtCategory = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  opacity: 0.6;
  white-space: nowrap;
`
