import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import GlassButton from './GlassButton'
import Logo from './Logo'

export default function GlassNavbar() {
  const { admin, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center">
            <Logo size="default" />
          </Link>

          <div className="flex items-center gap-3">
            <GlassButton
              variant="ghost"
              className="!p-2"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </GlassButton>

            <span className="text-white/70 text-sm hidden sm:block">
              {admin?.name}
            </span>
            <GlassButton variant="ghost" onClick={handleLogout}>
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </GlassButton>
          </div>
        </div>
      </div>
    </nav>
  )
}
