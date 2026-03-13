export type ThemeColors = Record<string, string>

export const darkColors: ThemeColors = {
  primary: '#38bdf8',
  primaryHover: '#7dd3fc',
  primaryDark: '#0ea5e9',
  accent: '#f59e0b',
  accentHover: '#fbbf24',
  accentDark: '#d97706',
  bg: '#0f1117',
  bgCard: '#1a1d2b',
  bgElevated: '#242838',
  bgInput: '#151823',
  bgCode: '#161822',
  text: '#e2e8f0',
  textBright: '#f8fafc',
  textMuted: '#94a3b8',
  textGold: '#fbbf24',
  border: '#2d3348',
  borderLight: '#3d4460',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  protected: '#ef4444',
  hwEvent: '#f59e0b',
  luaType: '#c084fc',
  paramType: '#67e8f9',
  returnType: '#86efac',
}

export const lightColors: ThemeColors = {
  primary: '#9a3412',
  primaryHover: '#b45309',
  primaryDark: '#7c2d12',
  accent: '#075985',
  accentHover: '#0369a1',
  accentDark: '#0c4a6e',
  bg: '#eee8de',
  bgCard: '#f8f4ed',
  bgElevated: '#e0d7c9',
  bgInput: '#ece5da',
  bgCode: '#e5ddd1',
  text: '#1c1408',
  textBright: '#0f0a02',
  textMuted: '#44382a',
  textGold: '#7c2d12',
  border: '#c4b496',
  borderLight: '#a08e72',
  success: '#166534',
  error: '#991b1b',
  warning: '#92400e',
  protected: '#991b1b',
  hwEvent: '#92400e',
  luaType: '#6b21a8',
  paramType: '#155e75',
  returnType: '#166534',
}

/** CSS-variable-backed color references — works in any styled-component */
const colorVars = Object.keys(darkColors).reduce(
  (acc, key) => {
    acc[key] = `var(--color-${key})`
    return acc
  },
  {} as ThemeColors,
)

export const theme = {
  colors: colorVars,
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Lora', serif",
    code: "'JetBrains Mono', monospace",
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  sidebar: {
    width: '280px',
    collapsedWidth: '64px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
} as const

export type Theme = typeof theme
