import { type ReactNode, useCallback, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  resultCount?: number
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search functions, events, types...',
  autoFocus = false,
  resultCount,
}: SearchBarProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Container>
      <SearchIcon size={18} />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        spellCheck={false}
      />
      {resultCount !== undefined && value.length > 0 && (
        <ResultCount>{resultCount} results</ResultCount>
      )}
      {value.length > 0 && (
        <ClearButton onClick={handleClear} aria-label="Clear search">
          <X size={16} />
        </ClearButton>
      )}
      <Shortcut>/</Shortcut>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${theme.colors.bgInput};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: ${theme.colors.primary};
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  color: ${theme.colors.textMuted};
  pointer-events: none;
`

const Input = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${theme.colors.textBright};
  font-size: 15px;
  padding: 12px 14px 12px 44px;
  font-family: ${theme.fonts.body};

  &::placeholder {
    color: ${theme.colors.textMuted};
    opacity: 0.6;
  }
`

const ResultCount = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  white-space: nowrap;
  padding-right: 8px;
`

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  margin-right: 4px;
  border-radius: ${theme.radius.sm};

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgElevated};
  }
`

const Shortcut = styled.kbd`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.bgElevated};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 2px 6px;
  margin-right: 10px;
  opacity: 0.6;
`
