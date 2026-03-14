import { type ReactNode, useState, useMemo, useRef, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { ExternalLink } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { ListHeader, ListTitle, ListCount, Filters, FilterGroup, FilterButton } from '../../../components/shared/ListPage.tsx'
import { ExternalRef } from '../../../components/shared/DetailPage.tsx'
import { CVARS } from '../../../data/cvars.ts'

const ROW_HEIGHT = 42

const ALL_CATEGORIES = Array.from(new Set(CVARS.map((c) => c.category))).sort()

const CVarsPage = (): ReactNode => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(600)

  const filtered = useMemo(() => {
    let result = CVARS
    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory)
    }
    if (query.length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      result = result.filter((c) => {
        const text = `${c.name} ${c.description} ${c.category}`.toLowerCase()
        return terms.every((term) => text.includes(term))
      })
    }
    return result
  }, [query, selectedCategory])

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }
  }, [])

  const refCallback = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (!node) return
      handleResize()
      const observer = new ResizeObserver(handleResize)
      observer.observe(node)
      return () => observer.disconnect()
    },
    [handleResize],
  )

  return (
    <Container>
      <ListHeader>
        <ListTitle>Console Variables (CVars)</ListTitle>
        <ListCount>
          {filtered.length} cvars · {ALL_CATEGORIES.length} categories
        </ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search CVars..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <Filters>
        <FilterGroup>
          <FilterButton $active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
            All
          </FilterButton>
          {ALL_CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              $active={selectedCategory === cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {cat}
            </FilterButton>
          ))}
        </FilterGroup>
      </Filters>

      <TableHeader>
        <HeaderName>Name</HeaderName>
        <HeaderDefault>Default</HeaderDefault>
        <HeaderCategory>Category</HeaderCategory>
      </TableHeader>

      <ListContainer ref={refCallback}>
        <FixedSizeList
          height={containerHeight}
          itemCount={filtered.length}
          itemSize={ROW_HEIGHT}
          width="100%"
        >
          {({ index, style }) => {
            const c = filtered[index]
            return (
              <Row style={style} $even={index % 2 === 0}>
                <CellName>{c.name}</CellName>
                <CellDefault>{c.defaultValue || '—'}</CellDefault>
                <CellCategory>{c.category}</CellCategory>
              </Row>
            )
          }}
        </FixedSizeList>
      </ListContainer>

      <SourceLink>
        <ExternalRef
          href="https://web.archive.org/web/20100701213739/http://wowprogramming.com/docs/cvars"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          Source: WoWProgramming.com CVars (archived)
        </ExternalRef>
      </SourceLink>
    </Container>
  )
}

export default CVarsPage

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-family: ${theme.fonts.heading};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${theme.colors.textMuted};
  border-bottom: 1px solid ${theme.colors.border};
`

const HeaderName = styled.span`
  flex: 2;
`

const HeaderDefault = styled.span`
  flex: 1;
`

const HeaderCategory = styled.span`
  flex: 1;
`

const ListContainer = styled.div`
  flex: 1;
  min-height: 400px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
`

const Row = styled.div<{ $even: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: ${({ $even }) => ($even ? theme.colors.bgCard : 'transparent')};
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`

const CellName = styled.span`
  flex: 2;
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CellDefault = styled.span`
  flex: 1;
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

const CellCategory = styled.span`
  flex: 1;
  font-size: 12px;
  color: ${theme.colors.text};
`

const SourceLink = styled.div`
  padding-top: 4px;
`
