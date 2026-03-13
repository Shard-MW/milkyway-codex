import { type ReactNode, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { WIDGETS_MAP } from '../../../data/widgets.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { Tag } from '../../../components/shared/Tag.tsx'
import {
  DetailContainer,
  BackLink,
  DetailHeader,
  DetailName,
  Badges,
  Description,
  Section,
  SectionTitle,
  RelatedList,
  NotFound,
} from '../../../components/shared/DetailPage.tsx'
import { DataTable } from '../../../components/shared/DataTable.tsx'

const WidgetDetailPage = (): ReactNode => {
  const { widgetName } = useParams<{ widgetName: string }>()
  const navigate = useNavigate()
  const [methodQuery, setMethodQuery] = useState('')

  const widget = widgetName ? WIDGETS_MAP.get(widgetName) : undefined

  const filteredOwn = useMemo(() => {
    if (!widget) return []
    if (methodQuery.length === 0) return widget.methods
    const q = methodQuery.toLowerCase()
    return widget.methods.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q),
    )
  }, [widget, methodQuery])

  const filteredInherited = useMemo(() => {
    if (!widget) return []
    if (methodQuery.length === 0) return widget.inheritedMethods
    const q = methodQuery.toLowerCase()
    return widget.inheritedMethods.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q),
    )
  }, [widget, methodQuery])

  if (!widget) {
    return (
      <DetailContainer $maxWidth="960px">
        <BackLink onClick={() => navigate('/widgets')}>
          <ArrowLeft size={16} /> Back to Widgets
        </BackLink>
        <NotFound>
          <h2>Widget not found</h2>
          <p>The widget &quot;{widgetName}&quot; does not exist in the 3.3.5a API.</p>
        </NotFound>
      </DetailContainer>
    )
  }

  const totalFiltered = filteredOwn.length + filteredInherited.length

  return (
    <DetailContainer $maxWidth="960px">
      <BackLink onClick={() => navigate('/widgets')}>
        <ArrowLeft size={16} /> Back to Widgets
      </BackLink>

      <DetailHeader>
        <DetailName $color={theme.colors.luaType}>{widget.name}</DetailName>
        <Badges>
          <Tag label={widget.category} variant="category" />
          <Tag label={`${widget.methods.length} own methods`} />
          <Tag label={`${widget.inheritedMethods.length} inherited`} />
        </Badges>
      </DetailHeader>

      <Description>{widget.description}</Description>

      {widget.inherits.length > 0 && (
        <Section>
          <SectionTitle>Inherits From</SectionTitle>
          <RelatedList>
            {widget.inherits.map((parentName) => (
              <InheritLink key={parentName} to={`/widgets/${parentName}`}>
                {parentName}
              </InheritLink>
            ))}
          </RelatedList>
        </Section>
      )}

      <Section>
        <SectionTitle>
          Methods ({widget.methods.length + widget.inheritedMethods.length} total)
        </SectionTitle>
        <SearchBar
          value={methodQuery}
          onChange={setMethodQuery}
          placeholder="Filter methods..."
          resultCount={methodQuery.length > 0 ? totalFiltered : undefined}
        />
      </Section>

      {filteredOwn.length > 0 && (
        <Section>
          <SubTitle>
            Own Methods <MethodBadge>{filteredOwn.length}</MethodBadge>
          </SubTitle>
          <MethodsTable>
            <thead>
              <tr>
                <th>Signature</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwn.map((m) => (
                <tr key={m.name}>
                  <SigCell>
                    <code>{m.signature}</code>
                  </SigCell>
                  <td>{m.description}</td>
                </tr>
              ))}
            </tbody>
          </MethodsTable>
        </Section>
      )}

      {filteredInherited.length > 0 && (
        <Section>
          <SubTitle>
            Inherited Methods <MethodBadge>{filteredInherited.length}</MethodBadge>
          </SubTitle>
          <MethodsTable>
            <thead>
              <tr>
                <th>Signature</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredInherited.map((m) => (
                <tr key={m.name}>
                  <SigCell>
                    <code>{m.signature}</code>
                  </SigCell>
                  <td>{m.description}</td>
                </tr>
              ))}
            </tbody>
          </MethodsTable>
        </Section>
      )}
    </DetailContainer>
  )
}

export default WidgetDetailPage

const InheritLink = styled(Link)`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.luaType};
  padding: 4px 10px;
  background: rgba(192, 132, 252, 0.06);
  border: 1px solid rgba(192, 132, 252, 0.15);
  border-radius: ${theme.radius.sm};

  &:hover {
    background: rgba(192, 132, 252, 0.12);
    border-color: rgba(192, 132, 252, 0.3);
  }
`

const SubTitle = styled.h3`
  font-size: 14px;
  color: ${theme.colors.textBright};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const MethodBadge = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  background: rgba(56, 189, 248, 0.1);
  color: ${theme.colors.primary};
`

const MethodsTable = styled(DataTable)`
  tr:hover td {
    background: ${theme.colors.bgElevated};
  }
`

const SigCell = styled.td`
  code {
    font-family: ${theme.fonts.code};
    font-size: 12px;
    color: ${theme.colors.textBright};
    white-space: nowrap;
  }
`
