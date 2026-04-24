import { type ReactNode, useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { WIDGETS_MAP } from '../../../data/widgets.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { Tag } from '../../../components/shared/Tag.tsx'
import { FreshnessBadge } from '../../../components/shared/FreshnessBadge.tsx'
import {
  DetailContainer,
  BackLink,
  DetailHeader,
  DetailName,
  Badges,
  Description,
  Section,
  SectionTitle,
  NotFound,
  RelatedList,
  BookRefLink,
} from '../../../components/shared/DetailPage.tsx'
import { DataTable, NameCell, TypeCell } from '../../../components/shared/DataTable.tsx'
import { TypeLink } from '../../../components/shared/TypeLink.tsx'
import { CodeBlock } from '../../../components/shared/CodeBlock.tsx'
import type { WidgetMethod } from '../../../types/api.types.ts'

const WidgetDetailPage = (): ReactNode => {
  const { widgetName } = useParams<{ widgetName: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [methodQuery, setMethodQuery] = useState('')
  const [expandedMethods, setExpandedMethods] = useState<Set<string>>(new Set())

  const widget = widgetName ? WIDGETS_MAP.get(widgetName) : undefined

  // Auto-expand and scroll to method from URL hash (e.g. #GetChange)
  useEffect(() => {
    const hash = location.hash.slice(1)
    if (!hash || !widget) return
    const ownMatch = widget.methods.find((m) => {
      const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
      return short === hash
    })
    const inhMatch = widget.inheritedMethods.find((m) => {
      const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
      return short === hash
    })
    const key = ownMatch ? `own-${ownMatch.name}` : inhMatch ? `inh-${inhMatch.name}` : null
    if (!key) return
    setExpandedMethods((prev) => new Set(prev).add(key))
    requestAnimationFrame(() => {
      document.getElementById(`method-${hash}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [location.hash, widget])

  const toggleMethod = useCallback((key: string) => {
    setExpandedMethods((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

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
      <DetailContainer $maxWidth="1100px">
        <BackLink onClick={() => navigate('/widgets')}>
          <ArrowLeft size={16} /> Back to Client Functions
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
    <DetailContainer $maxWidth="1100px">
      <BackLink onClick={() => navigate('/widgets')}>
        <ArrowLeft size={16} /> Back to Client Functions
      </BackLink>

      <DetailHeader>
        <DetailName $color={theme.colors.luaType}>{widget.name}</DetailName>
        <Badges>
          <FreshnessBadge
            description={widget.description}
            bookPage={widget.bookPage}
          />
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
          <MethodList>
            {filteredOwn.map((m) => {
              const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
              return (
                <MethodCard
                  key={`own-${m.name}`}
                  id={`method-${short}`}
                  method={m}
                  expanded={expandedMethods.has(`own-${m.name}`)}
                  onToggle={() => toggleMethod(`own-${m.name}`)}
                />
              )
            })}
          </MethodList>
        </Section>
      )}

      {filteredInherited.length > 0 && (
        <Section>
          <SubTitle>
            Inherited Methods <MethodBadge>{filteredInherited.length}</MethodBadge>
          </SubTitle>
          <MethodList>
            {filteredInherited.map((m) => {
              const short = m.name.match(/:(\w+)/)?.[1] ?? m.name
              return (
                <MethodCard
                  key={`inh-${m.name}`}
                  id={`method-${short}`}
                  method={m}
                  expanded={expandedMethods.has(`inh-${m.name}`)}
                  onToggle={() => toggleMethod(`inh-${m.name}`)}
                />
              )
            })}
          </MethodList>
        </Section>
      )}

      {widget.bookPage && (
        <BookRefLink href={`/book?page=${widget.bookPage}`}>
          <BookOpen size={14} />
          View in Reference Book (p.{widget.bookPage})
        </BookRefLink>
      )}
    </DetailContainer>
  )
}

const MethodCard = ({
  id,
  method,
  expanded,
  onToggle,
}: {
  id: string
  method: WidgetMethod
  expanded: boolean
  onToggle: () => void
}): ReactNode => {
  const hasDetails =
    (method.parameters && method.parameters.length > 0) ||
    (method.returns && method.returns.length > 0) ||
    (method.behavior && method.behavior.length > 0) ||
    (method.caveats && method.caveats.length > 0) ||
    !!method.example

  // Extract just the method name from the full signature for display
  // e.g., "duration = Alpha:GetDuration()" -> "GetDuration"
  const methodNameMatch = method.name.match(/:(\w+)/)
  const shortName = methodNameMatch ? methodNameMatch[1] : method.name

  // Extract clean signature (the part before " - description")
  const sigParts = method.signature.split(' - ')
  const cleanSig = sigParts[0].trim()

  return (
    <MethodCardWrapper id={id}>
      <MethodHeader onClick={onToggle} $clickable={hasDetails}>
        <MethodHeaderLeft>
          {hasDetails && (
            <ExpandIcon>
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </ExpandIcon>
          )}
          {!hasDetails && <ExpandPlaceholder />}
          <MethodName>{shortName}</MethodName>
        </MethodHeaderLeft>
        <MethodDesc>{method.description}</MethodDesc>
      </MethodHeader>

      {expanded && (
        <MethodDetails>
          <SignatureBlock>
            <code>{cleanSig}</code>
          </SignatureBlock>

          {method.parameters && method.parameters.length > 0 && (
            <MethodSection>
              <MethodSectionTitle>Parameters</MethodSectionTitle>
              <DataTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {method.parameters.map((p) => (
                    <tr key={p.name}>
                      <NameCell>
                        {p.name}
                        {p.optional && <Optional>optional</Optional>}
                      </NameCell>
                      <TypeCell><TypeLink type={p.type || '—'} /></TypeCell>
                      <td>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </MethodSection>
          )}

          {method.returns && method.returns.length > 0 && (
            <MethodSection>
              <MethodSectionTitle>Returns</MethodSectionTitle>
              <DataTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {method.returns.map((r, i) => (
                    <tr key={i}>
                      <NameCell>{r.name}</NameCell>
                      <TypeCell><TypeLink type={r.type || '—'} /></TypeCell>
                      <td>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </MethodSection>
          )}

          {method.behavior && method.behavior.length > 0 && (
            <MethodSection>
              <MethodSectionTitle>Behavior</MethodSectionTitle>
              <Prose>
                {method.behavior.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Prose>
            </MethodSection>
          )}

          {method.caveats && method.caveats.length > 0 && (
            <MethodSection>
              <MethodSectionTitle>Caveats</MethodSectionTitle>
              <Prose as="ul">
                {method.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </Prose>
            </MethodSection>
          )}

          {method.example && (
            <MethodSection>
              <MethodSectionTitle>Example</MethodSectionTitle>
              <CodeBlock
                code={method.example.code}
                language={method.example.language}
                title={method.example.title}
              />
            </MethodSection>
          )}
        </MethodDetails>
      )}
    </MethodCardWrapper>
  )
}

export default WidgetDetailPage

// Styled components at bottom

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

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const MethodCardWrapper = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  overflow: hidden;

  & + & {
    margin-top: -1px;
  }
`

const MethodHeader = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 12px;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  background: ${theme.colors.bgCard};

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`

const MethodHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`

const ExpandIcon = styled.span`
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
`

const ExpandPlaceholder = styled.span`
  width: 14px;
`

const MethodName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright};
  white-space: nowrap;
`

const MethodDesc = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MethodDetails = styled.div`
  padding: 12px 16px 16px;
  background: ${theme.colors.bgCode};
  border-top: 1px solid ${theme.colors.border};
`

const SignatureBlock = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 10px 14px;
  margin-bottom: 12px;

  code {
    font-family: ${theme.fonts.code};
    font-size: 13px;
    color: ${theme.colors.textBright};
  }
`

const MethodSection = styled.div`
  margin-top: 12px;
`

const MethodSectionTitle = styled.h4`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${theme.colors.textMuted};
  margin-bottom: 6px;
`

const Optional = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 10px;
  color: ${theme.colors.textMuted};
  margin-left: 6px;
  font-style: italic;
`

const Prose = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: ${theme.colors.text};

  p {
    margin: 0 0 8px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  &,
  ul {
    margin: 0;
  }

  ul,
  &:is(ul) {
    padding-left: 20px;
    list-style: disc;
  }

  li {
    margin-bottom: 6px;
  }

  li:last-child {
    margin-bottom: 0;
  }
`
