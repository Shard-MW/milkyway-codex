import { type ReactNode, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { Tag } from '../../../components/shared/Tag.tsx'
import { FreshnessBadge } from '../../../components/shared/FreshnessBadge.tsx'
import {
  DetailContainer,
  BackLink,
  DetailHeader,
  DetailName,
  Badges,
  Section,
  SectionTitle,
  RelatedList,
  ExternalRef,
  NotFound,
} from '../../../components/shared/DetailPage.tsx'
import { LinkedDescription } from '../../../components/shared/LinkedDescription.tsx'
import { DataTable } from '../../../components/shared/DataTable.tsx'
import { DBCS, DBCS_MAP, CATEGORY_LABELS } from '../../../data/dbcs.ts'
import { DBCTypeBadge } from '../components/DBCTypeBadge.tsx'
import { FkLink } from '../components/FkLink.tsx'

const MAX_SAME_CATEGORY = 8

const DbcDetailPage = (): ReactNode => {
  const { dbcName } = useParams<{ dbcName: string }>()
  const navigate = useNavigate()
  const dbc = dbcName ? DBCS_MAP.get(dbcName) : undefined

  const seeAlso = useMemo(() => {
    if (!dbc) return []
    const seen = new Set<string>()
    const result: string[] = []
    const push = (n: string): void => {
      if (n === dbc.name || seen.has(n) || !DBCS_MAP.has(n)) return
      seen.add(n)
      result.push(n)
    }
    for (const n of dbc.related) push(n)
    for (const f of dbc.fields) {
      if (f.fkTarget) push(f.fkTarget)
    }
    const sameCategory = DBCS
      .filter((d) => d.category === dbc.category && d.name !== dbc.name)
      .slice(0, MAX_SAME_CATEGORY)
    for (const d of sameCategory) push(d.name)
    return result
  }, [dbc])

  if (!dbc) {
    return (
      <DetailContainer>
        <BackLink onClick={() => navigate('/dbcs')}>
          <ArrowLeft size={16} /> Back to DBCs
        </BackLink>
        <NotFound>
          <h2>DBC not found</h2>
          <p>The DBC &quot;{dbcName}&quot; is not in the 3.3.5a client data.</p>
        </NotFound>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer>
      <BackLink onClick={() => navigate('/dbcs')}>
        <ArrowLeft size={16} /> Back to DBCs
      </BackLink>

      <DetailHeader>
        <NameRow>
          <DetailName>{dbc.name}</DetailName>
          <HeaderFilename>{dbc.filename}</HeaderFilename>
        </NameRow>
        <Badges>
          <FreshnessBadge
            description={dbc.description}
            documentationUrl={dbc.documentationUrl}
            bookPage={dbc.bookPage}
            memoryAddress={dbc.memoryAddress}
          />
          <Tag label={CATEGORY_LABELS[dbc.category]} variant="category" />
          <Tag label={`${dbc.fieldCount} fields`} variant="muted" />
          <Tag label={dbc.patch} variant="muted" />
        </Badges>
      </DetailHeader>

      {dbc.description && (
        <Description>
          <LinkedDescription text={dbc.description} />
        </Description>
      )}

      <Section>
        <SectionTitle>Fields</SectionTitle>
        <DataTable>
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {dbc.fields.map((f) => {
              const displayName = f.name.replace(/\[\d+\]$/, '')
              const displayRawType = f.rawType.replace(/\[\d+\]$/, '').trim() || f.type
              return (
              <tr key={`${f.index}-${f.name}`}>
                <IndexCell>
                  {f.endIndex > f.index ? `${f.index}–${f.endIndex}` : f.index}
                </IndexCell>
                <NameCellWrap>
                  <FieldName>{displayName}</FieldName>
                  {f.arrayLength && <ArrayChip>×{f.arrayLength}</ArrayChip>}
                </NameCellWrap>
                <TypeCellWrap>
                  <TypeStack>
                    <DBCTypeBadge type={f.type} rawType={displayRawType} />
                    {f.fkTarget && <FkLink target={f.fkTarget} />}
                  </TypeStack>
                </TypeCellWrap>
                <DescCell>
                  {f.description && <LinkedDescription text={f.description} />}
                  {f.flagValues && f.flagValues.length > 0 && (
                    <ValuesBlock>
                      <ValuesTitle>Flags</ValuesTitle>
                      <DataTable>
                        <tbody>
                          {f.flagValues.map((v) => (
                            <tr key={v.bit}>
                              <ValueCell>1 &lt;&lt; {v.bit}</ValueCell>
                              <ValueNameCell>{v.name}</ValueNameCell>
                              <td>{v.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </ValuesBlock>
                  )}
                  {f.enumValues && f.enumValues.length > 0 && (
                    <ValuesBlock>
                      <ValuesTitle>Values</ValuesTitle>
                      <DataTable>
                        <tbody>
                          {f.enumValues.map((v) => (
                            <tr key={String(v.value)}>
                              <ValueCell>{v.value}</ValueCell>
                              <ValueNameCell>{v.name}</ValueNameCell>
                              <td>{v.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </ValuesBlock>
                  )}
                </DescCell>
              </tr>
              )
            })}
          </tbody>
        </DataTable>
      </Section>

      {seeAlso.length > 0 && (
        <Section>
          <SectionTitle>See also</SectionTitle>
          <RelatedList>
            {seeAlso.map((n) => (
              <RelatedLink key={n} to={`/dbcs/${n}`}>
                {n}
              </RelatedLink>
            ))}
          </RelatedList>
        </Section>
      )}

      <RefsSection>
        <ExternalRef
          href={dbc.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          View on wowdev.wiki
        </ExternalRef>
      </RefsSection>
    </DetailContainer>
  )
}

export default DbcDetailPage

const NameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
`

const HeaderFilename = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 14px;
  color: ${theme.colors.textMuted};
`

const Description = styled.div`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 20px;
`

const IndexCell = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.textMuted} !important;
  text-align: right;
  white-space: nowrap;
  vertical-align: top !important;
`

const NameCellWrap = styled.td`
  font-family: ${theme.fonts.code};
  color: ${theme.colors.textBright} !important;
  white-space: nowrap;
  vertical-align: top !important;
`

const FieldName = styled.span`
  font-family: ${theme.fonts.code};
  color: ${theme.colors.textBright};
`

const ArrayChip = styled.span`
  display: inline-block;
  margin-left: 6px;
  padding: 1px 5px;
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.accent};
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: ${theme.radius.sm};
`

const TypeCellWrap = styled.td`
  vertical-align: top !important;
  white-space: nowrap;
`

const TypeStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`

const DescCell = styled.td`
  vertical-align: top !important;
`

const ValuesBlock = styled.div`
  margin-top: 8px;
  padding: 8px 10px;
  background: ${theme.colors.bgCode};
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.border};
`

const ValuesTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${theme.colors.textMuted};
  margin-bottom: 4px;
`

const ValueCell = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.accent} !important;
  white-space: nowrap;
`

const ValueNameCell = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.textBright} !important;
  white-space: nowrap;
`

const RelatedLink = styled(Link)`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  padding: 4px 10px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.bgElevated};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.primary};
  text-decoration: none;

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(56, 189, 248, 0.1);
  }
`

const RefsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
`
