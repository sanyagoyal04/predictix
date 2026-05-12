import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const DISEASE_CONFIG = {
  heart:    { emoji: '❤️', label: 'Heart Disease', color: '#f38ba8', path: '/predict/heart' },
  diabetes: { emoji: '🩸', label: 'Diabetes',       color: '#fab387', path: '/predict/diabetes' },
  breast:   { emoji: '🎗️', label: 'Breast Cancer', color: '#f5c2e7', path: '/predict/breast' },
  lung:     { emoji: '🫁', label: 'Lung Cancer',    color: '#94e2d5', path: '/predict/lung' },
}

const PREDICTORS = Object.entries(DISEASE_CONFIG).map(([id, cfg]) => ({ id, ...cfg }))

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ stats: [], total: 0 })
  const [recentPredictions, setRecentPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, histRes] = await Promise.all([
          api.get('/predictions/stats'),
          api.get('/predictions/history?limit=5'),
        ])
        setStats(statsRes.data)
        setRecentPredictions(histRes.data.predictions || [])
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const barData = stats.stats.map(s => ({
    name: DISEASE_CONFIG[s._id]?.label || s._id,
    count: s.count,
    fill: DISEASE_CONFIG[s._id]?.color || '#89b4fa',
  }))

  const pieData = stats.stats.map(s => ({
    name: DISEASE_CONFIG[s._id]?.label || s._id,
    value: s.count,
    color: DISEASE_CONFIG[s._id]?.color || '#89b4fa',
  }))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, padding: '0 14px' }}>Navigation</div>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '📋', label: 'History', path: '/history' },
            { icon: 'ℹ️', label: 'About', path: '/about' },
          ].map(l => (
            <Link key={l.path} to={l.path} className="sidebar-link">
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, padding: '0 14px' }}>Predictors</div>
          {PREDICTORS.map(p => (
            <Link key={p.id} to={p.path} className="sidebar-link">
              <span>{p.emoji}</span><span>{p.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="dashboard-content" style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>
            {greeting}, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Here's your health prediction overview.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { icon: '📊', label: 'Total Predictions', value: loading ? '...' : stats.total, color: '#89b4fa' },
            { icon: '❤️', label: 'Heart Checks', value: loading ? '...' : (stats.stats.find(s => s._id === 'heart')?.count || 0), color: '#f38ba8' },
            { icon: '🩸', label: 'Diabetes Checks', value: loading ? '...' : (stats.stats.find(s => s._id === 'diabetes')?.count || 0), color: '#fab387' },
            { icon: '🫁', label: 'Cancer Scans', value: loading ? '...' : ((stats.stats.find(s => s._id === 'breast')?.count || 0) + (stats.stats.find(s => s._id === 'lung')?.count || 0)), color: '#94e2d5' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {stats.total > 0 && (
          <div className="grid-2" style={{ marginBottom: 32 }}>
            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Predictions by Disease</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#6c7086" fontSize={12} tick={{ fill: '#a6adc8' }} />
                  <YAxis stroke="#6c7086" fontSize={12} tick={{ fill: '#a6adc8' }} />
                  <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8 }} labelStyle={{ color: '#cdd6f4' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend formatter={(val) => <span style={{ color: '#a6adc8', fontSize: 12 }}>{val}</span>} />
                  <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Disease Predictor Cards */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.125rem' }}>Run a Prediction</h2>
          <div className="grid-4">
            {PREDICTORS.map((p) => (
              <Link key={p.id} to={p.path} className="card" style={{ textDecoration: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${p.color}10, ${p.color}05)`, borderColor: `${p.color}30` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{p.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: '0.8125rem', color: p.color }}>Predict Now →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Predictions */}
        {recentPredictions.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700 }}>Recent Predictions</h3>
              <Link to="/history" style={{ color: 'var(--accent-blue)', fontSize: '0.875rem', fontWeight: 500 }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentPredictions.map((p) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg-surface1)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{DISEASE_CONFIG[p.disease]?.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{DISEASE_CONFIG[p.disease]?.label}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className={`badge badge-${p.result?.prediction === 1 ? 'danger' : 'success'}`}>
                      {p.result?.riskLevel || 'Low'} Risk
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {p.result?.confidence}% conf.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentPredictions.length === 0 && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔬</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No predictions yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Select a disease predictor above to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
