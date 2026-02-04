import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiGrid } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import GlassButton from './GlassButton'

export default function GlassNavbar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/60 flex items-center justify-center">
              <FiGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Glass Forms</span>
          </Link>

          <div className="flex items-center gap-4">
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
