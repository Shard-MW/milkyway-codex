import { type ReactNode, useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ExternalLink, BookOpen } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { ListHeader, ListTitle, ListCount } from '../../../components/shared/ListPage.tsx'
import { ExternalRef, BookRefLink } from '../../../components/shared/DetailPage.tsx'
import { DataTable } from '../../../components/shared/DataTable.tsx'
import { LinkedDescription } from '../../../components/shared/LinkedDescription.tsx'
import { DATA_TYPES } from '../../../data/data-types.ts'

const DataTypesPage = (): ReactNode => {
  const location = useLocation()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const hash = location.hash.slice(1)
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const filtered = useMemo(() => {
    if (query.length === 0) return DATA_TYPES
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return DATA_TYPES.filter((t) => {
      const text = `${t.name} ${t.description}`.toLowerCase()
      return terms.every((term) => text.includes(term))
    })
  }, [query])

  return (
    <Container>
      <ListHeader>
        <ListTitle>Data Types</ListTitle>
        <ListCount>{filtered.length} types</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search data types..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <TypesList>
        {filtered.map((t) => (
          <TypeCard key={t.name} id={t.name}>
            <TypeName>{t.name}</TypeName>
            {t.description && (
              <TypeDesc>
                <LinkedDescription text={t.description} />
              </TypeDesc>
            )}
            {t.values.length > 0 && (
              <DataTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {t.values.map((v) => (
                    <tr key={v.name}>
                      <CodeCell>{v.name}</CodeCell>
                      <CodeCell>{v.value}</CodeCell>
                      <td>{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </TypeCard>
        ))}
      </TypesList>

      <SourceLinks>
        <BookRefLink href="/book?page=581">
          <BookOpen size={14} />
          View in Reference Book (Ch 27 — API Reference)
        </BookRefLink>
        <ExternalRef
          href="https://web.archive.org/web/20100701213739/http://wowprogramming.com/docs/api_types"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          Source: WoWProgramming.com API Types (archived)
        </ExternalRef>
      </SourceLinks>
    </Container>
  )
}

export default DataTypesPage

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TypesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TypeCard = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: 20px;
  overflow: hidden;
`

const TypeName = styled.h2`
  font-family: ${theme.fonts.code};
  font-size: 18px;
  color: ${theme.colors.luaType};
  margin-bottom: 8px;
`

const CodeCell = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright} !important;
`

const SourceLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
`

const TypeDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 12px;
  overflow-wrap: break-word;
  word-break: break-word;
`
