import { type ReactNode, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalStyle } from './styles/global.ts'
import { Layout } from './components/Layout/Layout.tsx'
import { Loader } from './components/shared/Loader.tsx'

const HomePage = lazy(() => import('./features/home/pages/HomePage.tsx'))
const ApiListPage = lazy(() => import('./features/api/pages/ApiListPage.tsx'))
const ApiFunctionPage = lazy(() => import('./features/api/pages/ApiFunctionPage.tsx'))
const EventsListPage = lazy(() => import('./features/events/pages/EventsListPage.tsx'))
const EventDetailPage = lazy(() => import('./features/events/pages/EventDetailPage.tsx'))
const DataTypesPage = lazy(() => import('./features/data-types/pages/DataTypesPage.tsx'))
const WidgetsPage = lazy(() => import('./features/widgets/pages/WidgetsPage.tsx'))
const WidgetDetailPage = lazy(() => import('./features/widgets/pages/WidgetDetailPage.tsx'))

export const App = (): ReactNode => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="api" element={<ApiListPage />} />
            <Route path="api/:functionName" element={<ApiFunctionPage />} />
            <Route path="events" element={<EventsListPage />} />
            <Route path="events/:eventName" element={<EventDetailPage />} />
            <Route path="data-types" element={<DataTypesPage />} />
            <Route path="widgets" element={<WidgetsPage />} />
            <Route path="widgets/:widgetName" element={<WidgetDetailPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
