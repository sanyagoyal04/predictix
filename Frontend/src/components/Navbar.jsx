import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between" style={{ width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #89b4fa, #cba6f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: 700, color: '#0d0d18',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>P</div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Predic<span style={{ background: 'linear-gradient(135deg, #89b4fa, #cba6f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tiX</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="flex items-center gap-md" style={{ gap: 4 }}>
          {[
            { path: '/', label: 'Home' },
            { path: '/about', label: 'About' },
            ...(isAuthenticated ? [
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/history', label: 'History' },
            ] : []),
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive(path) ? '#89b4fa' : '#a6adc8',
              background: isActive(path) ? 'rgba(137, 180, 250, 0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}>{label}</Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center" style={{ gap: 12 }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 12px',
                background: 'var(--bg-surface0)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #89b4fa, #cba6f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#0d0d18',
                }}>
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.fullName?.split(' ')[0]}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
