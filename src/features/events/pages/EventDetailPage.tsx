import type { ReactNode } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react'
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
  BookRefLink,
  PatchInfo,
  NotFound,
} from '../../../components/shared/DetailPage.tsx'
import { LinkedDescription } from '../../../components/shared/LinkedDescription.tsx'
import { DataTable, NameCell, TypeCell } from '../../../components/shared/DataTable.tsx'
import { EVENTS_MAP } from '../../../data/events.ts'

const EventDetailPage = (): ReactNode => {
  const { eventName } = useParams<{ eventName: string }>()
  const navigate = useNavigate()

  const evt = eventName ? EVENTS_MAP.get(eventName) : undefined

  if (!evt) {
    return (
      <DetailContainer>
        <BackLink onClick={() => navigate('/events')}>
          <ArrowLeft size={16} /> Back to Events
        </BackLink>
        <NotFound>
          <h2>Event not found</h2>
          <p>The event &quot;{eventName}&quot; does not exist in the 3.3.5a API.</p>
        </NotFound>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer>
      <BackLink onClick={() => navigate('/events')}>
        <ArrowLeft size={16} /> Back to Events
      </BackLink>

      <DetailHeader>
        <DetailName $color={theme.colors.accent}>{evt.name}</DetailName>
        <Badges>
          <FreshnessBadge
            description={evt.description}
            documentationUrl={evt.documentationUrl}
          />
          <Tag label={evt.category} variant="category" />
        </Badges>
      </DetailHeader>

      {evt.description && <LinkedDescription text={evt.description} />}

      {evt.parameters.length > 0 && (
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
              {evt.parameters.map((p) => (
                <tr key={p.name}>
                  <NameCell>{p.name}</NameCell>
                  <TypeCell>{p.type}</TypeCell>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Section>
      )}

      {evt.related.length > 0 && (
        <Section>
          <SectionTitle>See Also</SectionTitle>
          <RelatedList>
            {evt.related.map((name) => (
              <RelatedLink key={name} to={`/events/${name}`}>
                {name}
              </RelatedLink>
            ))}
          </RelatedList>
        </Section>
      )}

      <Section>
        {evt.documentationUrl && (
          <ExternalRef
            href={evt.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            View on WoWProgramming (archived)
          </ExternalRef>
        )}
        {evt.bookPage && (
          <BookRefLink href={`/book?page=${evt.bookPage}`}>
            <BookOpen size={14} />
            View in Reference Book (p.{evt.bookPage})
          </BookRefLink>
        )}
      </Section>

      <Section>
        <PatchInfo>Patch: {evt.patch}</PatchInfo>
      </Section>
    </DetailContainer>
  )
}

export default EventDetailPage

const RelatedLink = styled(Link)`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.accent};
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: ${theme.radius.sm};

  &:hover {
    background: rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.3);
  }
`
