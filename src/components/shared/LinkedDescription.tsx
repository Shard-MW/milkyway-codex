import { type ReactNode, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { API_FUNCTIONS } from '../../data/api-functions.ts'
import { EVENTS } from '../../data/events.ts'

const apiFunctionNames = new Set(API_FUNCTIONS.map((f) => f.name))
const eventNames = new Set(EVENTS.map((e) => e.name))

// Match: AzerothCore source-path markers, backtick-wrapped, hex literals,
//   function() calls, ALL_CAPS identifiers.
//   AzerothCore markers are emitted by transform.mjs as `<<azcore:src/...>>`.
const REF_PATTERN = /(<<azcore:[^>]+>>)|(`[^`]+`)|(0x[0-9A-Fa-f]{2,})|(\b[A-Za-z][A-Za-z0-9_.]*\w\(\))|(\b[A-Z][A-Z0-9_]{3,}\b)/g
const AZEROTH_REPO_BASE = 'https://github.com/azerothcore/azerothcore-wotlk/blob/master'

interface LinkedDescriptionProps {
  text: string
}

export const LinkedDescription = ({ text }: LinkedDescriptionProps): ReactNode => {
  const parts = useMemo(() => {
    const result: Array<{ key: string; content: ReactNode }> = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    REF_PATTERN.lastIndex = 0
    while ((match = REF_PATTERN.exec(text)) !== null) {
      // Push text before match
      if (match.index > lastIndex) {
        result.push({ key: `t${lastIndex}`, content: text.slice(lastIndex, match.index) })
      }

      const full = match[0]

      if (match[1]) {
        // AzerothCore source path: <<azcore:src/server/game/Reputation/ReputationMgr.h>>
        const path = full.slice('<<azcore:'.length, -2)
        const url = `${AZEROTH_REPO_BASE}/${path}`
        result.push({
          key: `a${match.index}`,
          content: (
            <AzerothLink href={url} target="_blank" rel="noopener noreferrer">
              {path}
            </AzerothLink>
          ),
        })
      } else if (match[2]) {
        // Backtick-wrapped: `SomeName` or `SomeName()`
        const inner = full.slice(1, -1)
        const cleanName = inner.replace(/\(\)$/, '')
        const link = resolveLink(cleanName)
        if (link) {
          result.push({ key: `r${match.index}`, content: <RefLink to={link}>{inner}</RefLink> })
        } else {
          result.push({ key: `c${match.index}`, content: <Code>{inner}</Code> })
        }
      } else if (match[3]) {
        // Hex literal: 0xF530007EAC083004
        result.push({ key: `c${match.index}`, content: <Code>{full}</Code> })
      } else if (match[4]) {
        // Function() pattern: FunctionName(), bit.band(), tonumber()
        const funcName = full.replace(/\(\)$/, '')
        if (apiFunctionNames.has(funcName)) {
          result.push({ key: `r${match.index}`, content: <RefLink to={`/api/${funcName}`}>{full}</RefLink> })
        } else {
          result.push({ key: `c${match.index}`, content: <Code>{full}</Code> })
        }
      } else if (match[5]) {
        // ALL_CAPS pattern — link if event, otherwise show as code
        if (eventNames.has(full)) {
          result.push({ key: `r${match.index}`, content: <RefLink to={`/events/${full}`}>{full}</RefLink> })
        } else {
          result.push({ key: `c${match.index}`, content: <Code>{full}</Code> })
        }
      }

      lastIndex = match.index + full.length
    }

    // Push remaining text
    if (lastIndex < text.length) {
      result.push({ key: `t${lastIndex}`, content: text.slice(lastIndex) })
    }

    return result
  }, [text])

  return (
    <DescriptionText>
      {parts.map((p) => (
        <span key={p.key}>{p.content}</span>
      ))}
    </DescriptionText>
  )
}

const AzerothLink = styled.a`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.accent};
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: ${theme.radius.sm};
  padding: 1px 5px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    background: rgba(245, 158, 11, 0.15);
  }
`

const resolveLink = (name: string): string | null => {
  if (apiFunctionNames.has(name)) return `/api/${name}`
  if (eventNames.has(name)) return `/events/${name}`
  return null
}

// Styled components at bottom
const DescriptionText = styled.p`
  font-size: 15px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`

const RefLink = styled(Link)`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.primary};
  text-decoration: none;
  background: rgba(56, 189, 248, 0.08);
  padding: 1px 4px;
  border-radius: ${theme.radius.sm};

  &:hover {
    text-decoration: underline;
    background: rgba(56, 189, 248, 0.15);
  }
`

const Code = styled.code`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright};
  background: ${theme.colors.bgElevated};
  padding: 1px 4px;
  border-radius: ${theme.radius.sm};
`
