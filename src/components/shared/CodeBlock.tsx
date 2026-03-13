import { type ReactNode, useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export const CodeBlock = ({ code, language = 'lua', title }: CodeBlockProps): ReactNode => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback((): void => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <Container>
      <Header>
        {title && <Title>{title}</Title>}
        <Language>{language}</Language>
        <CopyButton onClick={handleCopy} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </CopyButton>
      </Header>
      <Pre>
        <Code>{code}</Code>
      </Pre>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${theme.colors.bgElevated};
  border-bottom: 1px solid ${theme.colors.border};
`

const Title = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
`

const Language = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.bgCard};
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
`

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgCard};
  }
`

const Pre = styled.pre`
  padding: 16px;
  background: ${theme.colors.bgCode};
  overflow-x: auto;
  margin: 0;
`

const Code = styled.code`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  line-height: 1.6;
  color: ${theme.colors.text};
  white-space: pre;
`
