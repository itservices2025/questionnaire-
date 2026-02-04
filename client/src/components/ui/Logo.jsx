import { useTheme } from '../../context/ThemeContext'

export default function Logo({ size = 'default', className = '' }) {
  const { isDarkMode } = useTheme()

  const sizes = {
    small: { height: 36 },
    default: { height: 48 },
    large: { height: 64 },
  }

  const { height } = sizes[size] || sizes.default
  const textColor = isDarkMode ? '#ffffff' : '#1a1a2e'
  const accentColor = isDarkMode ? '#a78bfa' : '#7c3aed'

  return (
    <svg
      height={height}
      viewBox="0 0 170 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Border rectangle - tighter around NETRA */}
      <rect
        x="2"
        y="2"
        width="166"
        height="46"
        rx="4"
        stroke={textColor}
        strokeWidth="2.5"
        fill="none"
      />

      {/* NETRA text - centered */}
      <text
        x="85"
        y="34"
        fontFamily="Montserrat, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="8"
        fill={textColor}
        textAnchor="middle"
      >
        NETRA
      </text>

      {/* Stoic DNC text - inside box, bottom right corner */}
      <text
        x="160"
        y="44"
        fontFamily="Montserrat, sans-serif"
        fontSize="9"
        textAnchor="end"
        fill={textColor}
      >
        <tspan fontWeight="400">Stoic </tspan>
        <tspan fontWeight="700" fill={accentColor}>DNC</tspan>
      </text>
    </svg>
  )
}
