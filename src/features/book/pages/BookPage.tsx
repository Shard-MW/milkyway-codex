import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { ListHeader, ListTitle } from '../../../components/shared/ListPage.tsx'

const PDF_URL = '/wow-programming-wotlk.pdf'

const PARTS = [
  {
    title: 'Part I — Learning to Program',
    chapters: [
      { label: 'Ch 1 — Programming for WoW', page: 45 },
      { label: 'Ch 2 — Exploring Lua Basics', page: 55 },
      { label: 'Ch 3 — Functions & Control', page: 81 },
      { label: 'Ch 4 — Working with Tables', page: 95 },
      { label: 'Ch 5 — Advanced Functions', page: 119 },
      { label: 'Ch 6 — Lua Standard Libraries', page: 133 },
      { label: 'Ch 7 — Learning XML', page: 153 },
    ],
  },
  {
    title: 'Part II — Programming for WoW',
    chapters: [
      { label: 'Ch 8 — Addon Fundamentals', page: 165 },
      { label: 'Ch 9 — Working with Frames', page: 185 },
      { label: 'Ch 10 — Using Templates', page: 219 },
      { label: 'Ch 11 — Exploring the WoW API', page: 229 },
      { label: 'Ch 12 — BagBuddy Addon', page: 247 },
      { label: 'Ch 13 — Game Events', page: 285 },
      { label: 'Ch 14 — CombatTracker', page: 309 },
    ],
  },
  {
    title: 'Part III — Advanced Techniques',
    chapters: [
      { label: 'Ch 15 — Secure Templates', page: 327 },
      { label: 'Ch 16 — Bindings', page: 351 },
      { label: 'Ch 17 — Slash Commands', page: 379 },
      { label: 'Ch 18 — OnUpdate', page: 393 },
      { label: 'Ch 19 — Altering Blizzard UI', page: 401 },
      { label: 'Ch 20 — Creating Textures', page: 413 },
      { label: 'Ch 21 — Combat Log & Threat', page: 429 },
      { label: 'Ch 22 — Scroll Frames', page: 455 },
      { label: 'Ch 23 — Dropdown Menus', page: 477 },
      { label: 'Ch 24 — Tooltips', page: 493 },
      { label: 'Ch 25 — Protected Actions', page: 527 },
      { label: 'Ch 26 — Unit Frames', page: 543 },
    ],
  },
  {
    title: 'Part IV — Reference',
    chapters: [
      { label: 'Ch 27 — API Reference', page: 581 },
      { label: 'Ch 28 — API Categories', page: 1067 },
      { label: 'Ch 29 — Widget Reference', page: 1163 },
      { label: 'Ch 30 — Events Reference', page: 1319 },
    ],
  },
  {
    title: 'Part V — Appendixes',
    chapters: [
      { label: 'A — Best Practices', page: 1347 },
      { label: 'B — Addon Libraries', page: 1371 },
      { label: 'C — Version Control', page: 1381 },
      { label: 'D — Addon Resources', page: 1391 },
    ],
  },
] as const

const BookPage = (): ReactNode => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)

  const navigateToPage = (p: number): void => {
    setSearchParams({ page: String(p) })
  }

  return (
    <PageContainer>
      <ListHeader>
        <ListTitle>Reference Book</ListTitle>
        <DownloadLink href={PDF_URL} download="wow-programming-wotlk.pdf">
          <Download size={14} />
          Download PDF
        </DownloadLink>
      </ListHeader>
      <ContentArea>
        <ChapterSidebar>
          {PARTS.map((part) => (
            <PartGroup key={part.title}>
              <PartTitle>{part.title}</PartTitle>
              {part.chapters.map((ch) => (
                <ChapterButton
                  key={ch.page}
                  onClick={() => navigateToPage(ch.page)}
                  $active={currentPage === ch.page}
                >
                  {ch.label}
                </ChapterButton>
              ))}
            </PartGroup>
          ))}
        </ChapterSidebar>
        <PdfFrame
          key={currentPage}
          src={`${PDF_URL}#page=${currentPage}&navpanes=0`}
          title="WoW Programming Reference PDF"
        />
      </ContentArea>
    </PageContainer>
  )
}

export default BookPage

// Styled components at bottom
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 32px);
  gap: 16px;
`

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
`

const ChapterSidebar = styled.div`
  width: 240px;
  min-width: 240px;
  overflow-y: auto;
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 8px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const PartGroup = styled.div`
  margin-bottom: 12px;
`

const PartTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: ${theme.colors.textMuted};
  padding: 8px 8px 4px;
  opacity: 0.7;
`

const ChapterButton = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  font-family: ${theme.fonts.body};
  font-size: 12px;
  padding: 5px 8px;
  border-radius: ${theme.radius.sm};
  border: none;
  background: ${(p) => (p.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.primary : theme.colors.textMuted)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgElevated};
  }
`

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.heading};
  font-size: 11px;
  padding: 4px 12px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.colors.accent};
  background: rgba(245, 158, 11, 0.08);
  color: ${theme.colors.accent};
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: rgba(245, 158, 11, 0.15);
  }
`

const PdfFrame = styled.iframe`
  flex: 1;
  width: 100%;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bgCard};
`
