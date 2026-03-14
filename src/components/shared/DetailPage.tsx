import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

export const DetailContainer = styled.div<{ $maxWidth?: string }>`
  max-width: ${(p) => p.$maxWidth ?? '860px'};

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.body};
  font-size: 13px;
  color: ${theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;

  &:hover {
    color: ${theme.colors.primary};
  }
`

export const DetailHeader = styled.div`
  margin-bottom: 16px;
`

export const DetailName = styled.h1<{ $color?: string }>`
  font-family: ${theme.fonts.code};
  font-size: 28px;
  color: ${(p) => p.$color ?? theme.colors.primary};
  margin-bottom: 10px;
  word-break: break-word;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 22px;
  }
`

export const Badges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const Description = styled.p`
  font-size: 15px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 28px;
`

export const Section = styled.div`
  margin-bottom: 28px;
`

export const SectionTitle = styled.h2`
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${theme.colors.border};
`

export const RelatedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const ExternalRef = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${theme.colors.textMuted};

  &:hover {
    color: ${theme.colors.primary};
  }
`

export const PatchInfo = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

export const BookRefLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${theme.colors.accent};

  &:hover {
    color: ${theme.colors.textBright};
  }
`

export const NotFound = styled.div`
  text-align: center;
  padding: 48px;

  h2 {
    margin-bottom: 8px;
  }

  p {
    color: ${theme.colors.textMuted};
  }
`
