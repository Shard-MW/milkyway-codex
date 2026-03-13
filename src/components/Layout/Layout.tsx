import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Sidebar } from './Sidebar.tsx'

export const Layout = (): ReactNode => {
  return (
    <Container>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
`
