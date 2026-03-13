import type { ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

type TagVariant = 'default' | 'protected' | 'hwEvent' | 'category' | 'type'

interface TagProps {
  label: string
  variant?: TagVariant
  onClick?: () => void
}

const VARIANT_COLORS: Record<TagVariant, { bg: string; text: string; border: string }> = {
  default: { bg: theme.colors.bgElevated, text: theme.colors.textMuted, border: theme.colors.border },
  protected: { bg: 'rgba(239, 68, 68, 0.1)', text: theme.colors.protected, border: 'rgba(239, 68, 68, 0.3)' },
  hwEvent: { bg: 'rgba(245, 158, 11, 0.1)', text: theme.colors.hwEvent, border: 'rgba(245, 158, 11, 0.3)' },
  category: { bg: 'rgba(56, 189, 248, 0.1)', text: theme.colors.primary, border: 'rgba(56, 189, 248, 0.3)' },
  type: { bg: 'rgba(192, 132, 252, 0.1)', text: theme.colors.luaType, border: 'rgba(192, 132, 252, 0.3)' },
}

export const Tag = ({ label, variant = 'default', onClick }: TagProps): ReactNode => {
  const colors = VARIANT_COLORS[variant]
  return (
    <StyledTag
      $bg={colors.bg}
      $color={colors.text}
      $border={colors.border}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {label}
    </StyledTag>
  )
}

const StyledTag = styled.span<{
  $bg: string
  $color: string
  $border: string
  $clickable: boolean
}>`
  display: inline-flex;
  align-items: center;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$border};
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition: all 0.15s ease;
  white-space: nowrap;

  ${(p) =>
    p.$clickable &&
    `
    &:hover {
      filter: brightness(1.2);
    }
  `}
`
