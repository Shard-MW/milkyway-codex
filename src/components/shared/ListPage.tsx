import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

export const ListPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  gap: 16px;
`

export const ListHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`

export const ListTitle = styled.h1`
  font-size: 24px;
`

export const ListCount = styled.span`
  font-size: 14px;
  color: ${theme.colors.textMuted};
`

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const FilterGroup = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`

export const FilterButton = styled.button<{ $active: boolean }>`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${(p) => (p.$active ? theme.colors.primary : theme.colors.border)};
  background: ${(p) => (p.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.primary : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`

export const ListContainer = styled.div`
  flex: 1;
  min-height: 0;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`
