import type { ReactNode } from 'react'

interface CodexIconProps {
  size?: number
}

export const CodexIcon = ({ size = 24 }: CodexIconProps): ReactNode => {
  const scale = size / 24

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`codex-spine-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Left page (blue) */}
      <path
        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H3z"
        stroke="#38bdf8"
        strokeWidth={1.8 / scale}
        fill="rgba(56,189,248,0.06)"
      />
      {/* Right page (fire/orange) */}
      <path
        d="M12 7a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3V7z"
        stroke="#ff6b00"
        strokeWidth={1.8 / scale}
        fill="rgba(255,107,0,0.06)"
      />
      {/* Spine (gold, on top) */}
      <path
        d="M12 6v16"
        stroke={`url(#codex-spine-${size})`}
        strokeWidth={2.2 / scale}
      />
      {/* Left page code lines (blue tones) */}
      <line x1="4.5" y1="7" x2="9" y2="7" stroke="#38bdf8" strokeWidth={0.8 / scale} opacity="0.6" />
      <line x1="4.5" y1="10" x2="8" y2="10" stroke="#7dd3fc" strokeWidth={0.8 / scale} opacity="0.45" />
      <line x1="4.5" y1="13" x2="9.5" y2="13" stroke="#0ea5e9" strokeWidth={0.8 / scale} opacity="0.55" />
      {/* Right page code lines (fire tones) */}
      <line x1="15" y1="7" x2="19.5" y2="7" stroke="#ff6b00" strokeWidth={0.8 / scale} opacity="0.6" />
      <line x1="15" y1="10" x2="18.5" y2="10" stroke="#fbbf24" strokeWidth={0.8 / scale} opacity="0.5" />
      <line x1="15" y1="13" x2="19" y2="13" stroke="#f59e0b" strokeWidth={0.8 / scale} opacity="0.55" />
    </svg>
  )
}
