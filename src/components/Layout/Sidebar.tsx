import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Code2,
  Zap,
  Database,
  Layout as LayoutIcon,
  Sun,
  Moon,
  Terminal,
  Shield,
  BookOpen,
  Globe,
  ExternalLink,
} from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { useThemeMode } from '../../hooks/use-theme-mode.hook.ts'
import { CodexIcon } from '../shared/CodexIcon.tsx'

interface NavItem {
  to: string
  icon: typeof Home
  label: string
  external?: boolean
}

interface NavSection {
  title: string | null
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    items: [{ to: '/', icon: Home, label: 'Home' }],
  },
  {
    title: 'Reference',
    items: [
      { to: '/api', icon: Code2, label: 'Game Functions' },
      { to: '/widgets', icon: LayoutIcon, label: 'Client Functions' },
      { to: '/events', icon: Zap, label: 'Events' },
    ],
  },
  {
    title: null,
    items: [
      { to: '/data-types', icon: Database, label: 'Data Types' },
      { to: '/secure-templates', icon: Shield, label: 'Secure Templates' },
      { to: '/cvars', icon: Terminal, label: 'CVars' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { to: '/book', icon: BookOpen, label: 'Reference Book' },
      { to: 'https://web.archive.org/web/20100815080955/http://wowprogramming.com/docs', icon: Globe, label: 'WoWProgramming', external: true },
    ],
  },
]

interface SidebarProps {
  onNavigate?: () => void
}

export const Sidebar = ({ onNavigate }: SidebarProps): ReactNode => {
  const { mode, toggle } = useThemeMode()

  return (
    <Nav>
      <LogoSection>
        <LogoRow>
          <LogoTitle>
            <CodexIcon size={22} />
            <span>Codex</span>
          </LogoTitle>
          <ThemeToggle onClick={toggle} aria-label="Toggle theme">
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </ThemeToggle>
        </LogoRow>
        <LogoSub>WoW 3.3.5a Reference</LogoSub>
      </LogoSection>
      <NavContent>
        {NAV_SECTIONS.map((section, i) => (
          <Section key={i}>
            {i > 0 && !section.title && <Divider />}
            {section.title && <SectionTitle>{section.title}</SectionTitle>}
            <NavList>
              {section.items.map(({ to, icon: Icon, label, external }) => (
                <NavListItem key={to}>
                  {external ? (
                    <StyledExternalLink href={to} target="_blank" rel="noopener noreferrer">
                      <Icon size={16} />
                      <span>{label}</span>
                      <ExternalLink size={11} />
                    </StyledExternalLink>
                  ) : (
                    <StyledNavLink to={to} end={to === '/'} onClick={onNavigate}>
                      <Icon size={16} />
                      <span>{label}</span>
                    </StyledNavLink>
                  )}
                </NavListItem>
              ))}
            </NavList>
          </Section>
        ))}
      </NavContent>
      <Footer>
        <FooterText>MilkyWay Codex v1.0</FooterText>
        <FooterText>Client Build 12340</FooterText>
      </Footer>
    </Nav>
  )
}

const Nav = styled.nav`
  width: ${theme.sidebar.width};
  min-width: ${theme.sidebar.width};
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bgCard};
  border-right: 1px solid ${theme.colors.border};
`

const LogoSection = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${theme.colors.border};
`

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${theme.fonts.heading};
  font-size: 20px;
  color: ${theme.colors.textBright};
  letter-spacing: 1px;
`

const LogoSub = styled.p`
  font-size: 11px;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
  padding-left: 32px;
`

const NavContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`

const Section = styled.div`
  padding: 4px 8px;
`

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${theme.colors.textMuted};
  padding: 12px 12px 6px;
  opacity: 0.7;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 4px 12px 8px;
`

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const NavListItem = styled.li``

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-family: ${theme.fonts.heading};
  font-size: 13px;
  letter-spacing: 0.3px;
  color: ${theme.colors.textMuted};
  border-radius: ${theme.radius.md};
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgElevated};
  }

  &.active {
    color: ${theme.colors.primary};
    background: rgba(56, 189, 248, 0.08);
    border-left: 3px solid ${theme.colors.primary};
    padding-left: 9px;
  }
`

const StyledExternalLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-family: ${theme.fonts.heading};
  font-size: 13px;
  letter-spacing: 0.3px;
  color: ${theme.colors.textMuted};
  border-radius: ${theme.radius.md};
  transition: all 0.15s ease;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgElevated};
  }

  svg:last-child {
    margin-left: auto;
    opacity: 0.4;
  }
`

const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textMuted};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.accent};
    border-color: ${theme.colors.borderLight};
  }
`

const FooterText = styled.p`
  font-size: 10px;
  color: ${theme.colors.textMuted};
  opacity: 0.65;
  text-align: center;
`
