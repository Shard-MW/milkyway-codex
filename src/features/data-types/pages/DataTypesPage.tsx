import { type ReactNode, useState, useMemo } from 'react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { ListHeader, ListTitle, ListCount } from '../../../components/shared/ListPage.tsx'
import { DataTable, NameCell, TypeCell } from '../../../components/shared/DataTable.tsx'
import { DATA_TYPES } from '../../../data/data-types.ts'

const DataTypesPage = (): ReactNode => {
  const [query, setQuery] = useState('')

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
            {t.description && <TypeDesc>{t.description}</TypeDesc>}
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
                      <NameCell>{v.name}</NameCell>
                      <TypeCell>{v.value}</TypeCell>
                      <td>{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </TypeCard>
        ))}
      </TypesList>
    </Container>
  )
}

export default DataTypesPage

const Container = styled.div`
  max-width: 860px;
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
`

const TypeName = styled.h2`
  font-family: ${theme.fonts.code};
  font-size: 18px;
  color: ${theme.colors.luaType};
  margin-bottom: 8px;
`

const TypeDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 12px;
`
