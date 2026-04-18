import { type ReactNode, useState, useMemo, useEffect, useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { ListHeader, ListTitle, ListCount, Filters, FilterGroup, FilterButton } from '../../../components/shared/ListPage.tsx'
import { ExternalRef } from '../../../components/shared/DetailPage.tsx'
import { Tag } from '../../../components/shared/Tag.tsx'
import { LinkedDescription } from '../../../components/shared/LinkedDescription.tsx'
import { DBCS, DBC_CATEGORIES, CATEGORY_LABELS } from '../../../data/dbcs.ts'
import type { DBCCategory } from '../../../types/dbc.types.ts'

type CategoryFilter = DBCCategory | 'all'

const DbcsListPage = (): ReactNode => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>(
    (searchParams.get('category') as CategoryFilter | null) ?? 'all',
  )
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let items = DBCS
    if (category !== 'all') {
      items = items.filter((d) => d.category === category)
    }
    if (query.length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
      items = items.filter((d) => {
        const text = `${d.name} ${d.filename} ${d.description}`.toLowerCase()
        return terms.every((t) => text.includes(t))
      })
    }
    return items
  }, [query, category])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (category === 'all') next.delete('category')
    else next.set('category', category)
    setSearchParams(next, { replace: true })
  }, [category, searchParams, setSearchParams])

  useEffect(() => {
    const hash = location.hash.slice(1)
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  useEffect(() => {
    const container = listRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>('[id]')
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            const newHash = `#${entry.target.id}`
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash)
            }
            break
          }
        }
      },
      { threshold: 0.3 },
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [filtered])

  return (
    <Container>
      <ListHeader>
        <ListTitle>DBCs</ListTitle>
        <ListCount>{filtered.length} of {DBCS.length} tables</ListCount>
      </ListHeader>

      <Intro>
        Client data tables extracted from the WoW 3.3.5a client. These define the schema of files such as <code>Spell.dbc</code>, <code>Item.dbc</code>, and <code>Map.dbc</code> used by the game binary and addon APIs. Fields referencing other DBCs are linked.
      </Intro>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search DBCs..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <Filters>
        <FilterGroup>
          <FilterButton $active={category === 'all'} onClick={() => setCategory('all')}>All</FilterButton>
          {DBC_CATEGORIES.map((cat) => (
            <FilterButton key={cat} $active={category === cat} onClick={() => setCategory(cat)}>
              {CATEGORY_LABELS[cat]}
            </FilterButton>
          ))}
        </FilterGroup>
      </Filters>

      <DbcList ref={listRef}>
        {filtered.map((d) => (
          <DbcCard key={d.name} id={d.name} to={`/dbcs/${d.name}`}>
            <CardHeader>
              <DbcName>{d.name}</DbcName>
              <Filename>{d.filename}</Filename>
              <CardBadges>
                <Tag label={CATEGORY_LABELS[d.category]} variant="category" />
                <Tag label={`${d.fieldCount} fields`} />
              </CardBadges>
            </CardHeader>
            {d.description && (
              <CardDesc>
                <LinkedDescription text={d.description} />
              </CardDesc>
            )}
          </DbcCard>
        ))}
        {filtered.length === 0 && (
          <Empty>No DBCs match the current filters.</Empty>
        )}
      </DbcList>

      <SourceLinks>
        <ExternalRef
          href="https://wowdev.wiki/Category:DBC_WotLK"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          Source: wowdev.wiki DBC_WotLK category
        </ExternalRef>
      </SourceLinks>
    </Container>
  )
}

export default DbcsListPage

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Intro = styled.p`
  font-size: 13px;
  color: ${theme.colors.textMuted};
  line-height: 1.6;

  code {
    font-family: ${theme.fonts.code};
    font-size: 12px;
    color: ${theme.colors.textBright};
    padding: 1px 4px;
    background: ${theme.colors.bgCode};
    border-radius: ${theme.radius.sm};
  }
`

const DbcList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DbcCard = styled(Link)`
  display: block;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: 14px 18px;
  transition: border-color 0.15s ease, background 0.15s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.bgElevated};
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
`

const DbcName = styled.h2`
  font-family: ${theme.fonts.code};
  font-size: 16px;
  color: ${theme.colors.primary};
  margin: 0;
`

const Filename = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

const CardBadges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-left: auto;
`

const CardDesc = styled.div`
  font-size: 13px;
  color: ${theme.colors.text};
  line-height: 1.5;
  overflow-wrap: break-word;
`

const Empty = styled.div`
  text-align: center;
  padding: 32px;
  color: ${theme.colors.textMuted};
`

const SourceLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
`
