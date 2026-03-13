import { type ReactNode, useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { Sidebar } from './Sidebar.tsx'
import { CodexIcon } from '../shared/CodexIcon.tsx'
import { useEffect } from 'react'

export const Layout = (): ReactNode => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <Container>
      <MobileHeader>
        <HamburgerButton onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={22} />
        </HamburgerButton>
        <MobileLogo>
          <CodexIcon size={20} />
          <span>Codex</span>
        </MobileLogo>
      </MobileHeader>
      {sidebarOpen && <Overlay onClick={closeSidebar} />}
      <SidebarWrapper $open={sidebarOpen}>
        <Sidebar onNavigate={closeSidebar} />
      </SidebarWrapper>
      <Main>
        <Outlet />
      </Main>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`

const MobileHeader = styled.div`
  display: none;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: ${theme.colors.bgCard};
    border-bottom: 1px solid ${theme.colors.border};
    min-height: 48px;
  }
`

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${theme.colors.textBright};
  cursor: pointer;
  padding: 4px;
`

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${theme.fonts.heading};
  font-size: 18px;
  color: ${theme.colors.textBright};
  letter-spacing: 1px;
`

const Overlay = styled.div`
  display: none;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90;
  }
`

const SidebarWrapper = styled.div<{ $open: boolean }>`
  @media (max-width: ${theme.breakpoints.mobile}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(${(p) => (p.$open ? '0' : '-100%')});
    transition: transform 0.25s ease;
  }
`

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px;
  }
`
