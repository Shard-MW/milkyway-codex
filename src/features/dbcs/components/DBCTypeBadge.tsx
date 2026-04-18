import type { ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import type { DBCFieldType } from '../../../types/dbc.types.ts'

interface DBCTypeBadgeProps {
  type: DBCFieldType
  rawType: string
}

export const DBCTypeBadge = ({ type, rawType }: DBCTypeBadgeProps): ReactNode => {
  return <Badge $type={type}>{rawType || type}</Badge>
}

const TYPE_FG: Record<DBCFieldType, string> = {
  int8: theme.colors.paramType,
  int16: theme.colors.paramType,
  int32: theme.colors.paramType,
  int64: theme.colors.paramType,
  uint8: theme.colors.paramType,
  uint16: theme.colors.paramType,
  uint32: theme.colors.paramType,
  uint64: theme.colors.paramType,
  float: theme.colors.paramType,
  bool: theme.colors.paramType,
  string: theme.colors.returnType,
  stringref: theme.colors.returnType,
  loc: theme.colors.returnType,
  flags: theme.colors.accent,
  enum: theme.colors.accent,
  iref: theme.colors.primary,
  unknown: theme.colors.textMuted,
}

const TYPE_BG: Record<DBCFieldType, string> = {
  int8: 'rgba(103, 232, 249, 0.08)',
  int16: 'rgba(103, 232, 249, 0.08)',
  int32: 'rgba(103, 232, 249, 0.08)',
  int64: 'rgba(103, 232, 249, 0.08)',
  uint8: 'rgba(103, 232, 249, 0.08)',
  uint16: 'rgba(103, 232, 249, 0.08)',
  uint32: 'rgba(103, 232, 249, 0.08)',
  uint64: 'rgba(103, 232, 249, 0.08)',
  float: 'rgba(103, 232, 249, 0.08)',
  bool: 'rgba(103, 232, 249, 0.08)',
  string: 'rgba(134, 239, 172, 0.08)',
  stringref: 'rgba(134, 239, 172, 0.08)',
  loc: 'rgba(134, 239, 172, 0.08)',
  flags: 'rgba(245, 158, 11, 0.08)',
  enum: 'rgba(245, 158, 11, 0.08)',
  iref: 'rgba(56, 189, 248, 0.08)',
  unknown: 'rgba(148, 163, 184, 0.08)',
}

const Badge = styled.span<{ $type: DBCFieldType }>`
  display: inline-block;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
  color: ${(p) => TYPE_FG[p.$type]};
  background: ${(p) => TYPE_BG[p.$type]};
  white-space: nowrap;
`
