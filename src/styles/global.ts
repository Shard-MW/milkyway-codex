import { createGlobalStyle } from 'styled-components'
import { theme } from '../theme/theme.ts'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${theme.fonts.body};
    background: ${theme.colors.bg};
    color: ${theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.textBright};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
  }

  input, textarea, select {
    font-family: ${theme.fonts.body};
  }

  code, pre {
    font-family: ${theme.fonts.code};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.bg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.borderLight};
  }
`
