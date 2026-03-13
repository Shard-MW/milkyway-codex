import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    font-family: ${theme.fonts.heading};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${theme.colors.textMuted};
    padding: 8px 12px;
    border-bottom: 1px solid ${theme.colors.border};
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.text};
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }
`

export const NameCell = styled.td`
  font-family: ${theme.fonts.code};
  color: ${theme.colors.textBright} !important;
  white-space: nowrap;
`

export const TypeCell = styled.td`
  font-family: ${theme.fonts.code};
  color: ${theme.colors.paramType} !important;
  white-space: nowrap;
`
