import type { ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../theme/theme.ts'

export const Loader = (): ReactNode => {
  return (
    <Overlay>
      <Content>
        <RuneRing>
          <Rune $delay={0} />
          <Rune $delay={0.15} />
          <Rune $delay={0.3} />
          <Rune $delay={0.45} />
          <Rune $delay={0.6} />
          <Rune $delay={0.75} />
          <Rune $delay={0.9} />
          <Rune $delay={1.05} />
        </RuneRing>
        <Title>MilkyWay Codex</Title>
        <Subtitle>Loading WoW 3.3.5a Reference...</Subtitle>
      </Content>
    </Overlay>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${fadeIn} 0.4s ease-out;
`

const RuneRing = styled.div`
  width: 64px;
  height: 64px;
  position: relative;
  animation: ${rotate} 3s linear infinite;
`

const Rune = styled.div<{ $delay: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;

  &:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
  &:nth-child(2) { top: 9px; right: 9px; }
  &:nth-child(3) { top: 50%; right: 0; transform: translateY(-50%); }
  &:nth-child(4) { bottom: 9px; right: 9px; }
  &:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%); }
  &:nth-child(6) { bottom: 9px; left: 9px; }
  &:nth-child(7) { top: 50%; left: 0; transform: translateY(-50%); }
  &:nth-child(8) { top: 9px; left: 9px; }
`

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 28px;
  color: ${theme.colors.textBright};
  letter-spacing: 2px;
`

const Subtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 14px;
  color: ${theme.colors.textMuted};
`
