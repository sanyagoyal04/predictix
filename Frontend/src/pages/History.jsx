import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DISEASE_CONFIG = {
  heart:    { emoji: '❤️', label: 'Heart Disease', color: '#f38ba8' },
  diabetes: { emoji: '🩸', label: 'Diabetes',       color: '#fab387' },
  breast:   { emoji: '🎗️', label: 'Breast Cancer', color: '#f5c2e7' },
  lung:     { emoji: '🫁', label: 'Lung Cancer',    color: '#94e2d5' },
}

export default function History() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  useEffect(() => {
    loadHistory()
  }, [filter, page])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (filter !== 'all') params.append('disease', filter)
      const { data } = await api.get(`/predictions/history?${params}`)
      setPredictions(data.predictions)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async (predId, disease) => {
    try {
      const res = await api.get(`/predictions/report/${predId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = `predictix-${disease}-${predId}.pdf`; a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download report')
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Prediction History</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{pagination.total} total predictions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'heart', 'diabetes', 'breast', 'lung'].map(f => (
            <button key={f} id={`filter-${f}`}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setFilter(f); setPage(1) }}>
              {f === 'all' ? 'All' : DISEASE_CONFIG[f]?.emoji + ' ' + DISEASE_CONFIG[f]?.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : predictions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No predictions found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {filter !== 'all' ? `No ${DISEASE_CONFIG[filter]?.label} predictions yet.` : 'Start by running a prediction!'}
          </p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {predictions.map((p) => {
              const cfg = DISEASE_CONFIG[p.disease] || {}
              return (
                <div key={p._id} className="card animate-fade-in" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: '2rem', width: 48, height: 48, borderRadius: 12, background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cfg.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>{cfg.label}</span>
                        <span className={`badge badge-${p.result?.prediction === 1 ? 'danger' : 'success'}`}>
                          {p.result?.riskLevel} Risk
                        </span>
                        <span className="badge badge-info">{p.result?.model?.split(' ')[0]}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: p.result?.prediction === 1 ? '#f38ba8' : '#a6e3a1', fontWeight: 600 }}>
                        {p.result?.resultText}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {new Date(p.createdAt).toLocaleString()} · {p.processingTime}ms · Confidence: {p.result?.confidence}%
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => handleDownloadPDF(p._id, p.disease)}>📄 PDF</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
                <button key={n}
                  className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPage(n)}>{n}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
