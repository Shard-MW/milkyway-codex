import type { ReactNode } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { CodeBlock } from '../../../components/shared/CodeBlock.tsx'
import { Tag } from '../../../components/shared/Tag.tsx'
import { Tooltip } from '../../../components/shared/Tooltip.tsx'
import { TypeLink } from '../../../components/shared/TypeLink.tsx'
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
  BookRefLink,
  NotFound,
} from '../../../components/shared/DetailPage.tsx'
import { LinkedDescription } from '../../../components/shared/LinkedDescription.tsx'
import { DataTable, NameCell, TypeCell } from '../../../components/shared/DataTable.tsx'
import { API_FUNCTIONS_MAP } from '../../../data/api-functions.ts'

const ApiFunctionPage = (): ReactNode => {
  const { functionName } = useParams<{ functionName: string }>()
  const navigate = useNavigate()

  const fn = functionName ? API_FUNCTIONS_MAP.get(functionName) : undefined

  if (!fn) {
    return (
      <DetailContainer>
        <BackLink onClick={() => navigate('/api')}>
          <ArrowLeft size={16} /> Back to Game Functions
        </BackLink>
        <NotFound>
          <h2>Function not found</h2>
          <p>The function &quot;{functionName}&quot; does not exist in the 3.3.5a API.</p>
        </NotFound>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer>
      <BackLink onClick={() => navigate('/api')}>
        <ArrowLeft size={16} /> Back to Game Functions
      </BackLink>

      <DetailHeader>
        <NameRow>
          <DetailName>{fn.name}</DetailName>
          {fn.memoryAddress && (
            <Tooltip text="Memory address in WoW.exe (build 12340)">
              <MemoryAddress>{fn.memoryAddress}</MemoryAddress>
            </Tooltip>
          )}
        </NameRow>
        <Badges>
          <FreshnessBadge
            description={fn.description}
            memoryAddress={fn.memoryAddress}
            documentationUrl={fn.documentationUrl}
          />
          <Tag label={fn.category.replace(/ functions$/i, '').replace(/ actions$/i, '')} variant="category" />
          {fn.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </Badges>
      </DetailHeader>

      <LinkedDescription text={fn.description} />

      <Section>
        <SectionTitle>Signature</SectionTitle>
        <SignatureBlock>
          <code>{fn.signature}</code>
        </SignatureBlock>
      </Section>

      {fn.parameters.length > 0 && (
        <Section>
          <SectionTitle>Parameters</SectionTitle>
          <DataTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {fn.parameters.map((p) => (
                <tr key={p.name}>
                  <NameCell>
                    {p.name}
                    {p.optional && <Optional>optional</Optional>}
                  </NameCell>
                  <TypeCell>
                    <TypeLink type={p.type} />
                  </TypeCell>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Section>
      )}

      {fn.returns.length > 0 && (
        <Section>
          <SectionTitle>Returns</SectionTitle>
          <DataTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {fn.returns.map((r, i) => (
                <tr key={i}>
                  <NameCell>{r.name}</NameCell>
                  <TypeCell>
                    <TypeLink type={r.type} />
                  </TypeCell>
                  <td>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Section>
      )}

      {fn.examples.length > 0 && (
        <Section>
          <SectionTitle>Examples</SectionTitle>
          {fn.examples.map((ex, i) => (
            <CodeBlock key={i} code={ex.code} language={ex.language} title={ex.title} />
          ))}
        </Section>
      )}

      {fn.related.length > 0 && (
        <Section>
          <SectionTitle>See Also</SectionTitle>
          <RelatedList>
            {fn.related.map((name) => (
              <RelatedLink key={name} to={`/api/${name}`}>
                {name}
              </RelatedLink>
            ))}
          </RelatedList>
        </Section>
      )}

      <Section>
        {fn.documentationUrl && (
          <ExternalRef
            href={fn.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            View on WoWProgramming (archived)
          </ExternalRef>
        )}
        {fn.bookPage && (
          <BookRefLink href={`/book?page=${fn.bookPage}`}>
            <BookOpen size={14} />
            View in Reference Book (p.{fn.bookPage})
          </BookRefLink>
        )}
      </Section>
    </DetailContainer>
  )
}

export default ApiFunctionPage

const NameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
`

const MemoryAddress = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.bgCode};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 2px 8px;
  cursor: help;
`

const SignatureBlock = styled.div`
  background: ${theme.colors.bgCode};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 14px 18px;

  code {
    font-family: ${theme.fonts.code};
    font-size: 14px;
    color: ${theme.colors.textBright};
  }
`

const Optional = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  margin-left: 6px;
  font-style: italic;
`

const RelatedLink = styled(Link)`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.primary};
  padding: 4px 10px;
  background: rgba(56, 189, 248, 0.06);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: ${theme.radius.sm};

  &:hover {
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.3);
  }
`
