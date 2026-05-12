import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}! 🎉`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      <div className="hero-bg" />
      <div className="animate-fade-in-scale" style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ padding: 40 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #89b4fa, #cba6f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', margin: '0 auto 16px',
            }}>🔬</div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9375rem' }}>
              Sign in to access your health predictions
            </p>
          </div>

          {/* Demo hint */}
          <div style={{ background: 'rgba(137,180,250,0.08)', border: '1px solid rgba(137,180,250,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: '0.875rem', color: 'var(--accent-blue)' }}>
            💡 <strong>Demo:</strong> Create an account to get started, or use your existing credentials.
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input id="login-email" className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input id="login-password" className="form-input" type="password" name="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} autoComplete="current-password" />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" id="login-submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
