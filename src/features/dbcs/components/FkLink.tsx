import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'

interface FkLinkProps {
  target: string
}

export const FkLink = ({ target }: FkLinkProps): ReactNode => {
  return (
    <StyledLink to={`/dbcs/${target}`}>
      <ArrowRight size={11} />
      {target}
    </StyledLink>
  )
}

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.primary};
  margin-top: 4px;

  &:hover {
    color: ${theme.colors.primaryHover};
    text-decoration: underline;
  }
`
