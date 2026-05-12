import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email) errs.email = 'Email is required'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', { fullName: form.fullName, email: form.email, password: form.password })
      login(data.token, data.user)
      toast.success('Account created! Welcome to PredictiX 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const strengthScore = form.password.length >= 8 ? (form.password.length >= 12 ? 3 : 2) : form.password.length >= 6 ? 1 : 0
  const strengthLabels = ['', 'Weak', 'Moderate', 'Strong']
  const strengthColors = ['', '#f38ba8', '#f9e2af', '#a6e3a1']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div className="hero-bg" />
      <div className="animate-fade-in-scale" style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #a6e3a1, #89b4fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 16px' }}>🧬</div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Join PredictiX for free disease predictions</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input id="signup-name" className="form-input" type="text" name="fullName"
                placeholder="Dr. Jane Doe" value={form.fullName} onChange={handleChange} />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input id="signup-email" className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input id="signup-password" className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              {form.password && (
                <div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strengthScore ? strengthColors[strengthScore] : 'var(--bg-overlay)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strengthColors[strengthScore] }}>{strengthLabels[strengthScore]}</span>
                </div>
              )}
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <input id="signup-confirm" className="form-input" type="password" name="confirm"
                placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" id="signup-submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
