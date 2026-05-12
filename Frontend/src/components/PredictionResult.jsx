import api from '../utils/api'

export default function PredictionResult({ result, disease, predictionId, onReset }) {
  const isPositive = result.prediction === 1

  const handleDownloadPDF = async () => {
    try {
      const res = await api.get(`/predictions/report/${predictionId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `predictix-${disease}-report.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download report')
    }
  }

  const riskColors = { High: '#f38ba8', Moderate: '#f9e2af', Low: '#a6e3a1' }
  const riskColor = riskColors[result.risk_level] || '#a6e3a1'

  return (
    <div className={`animate-fade-in-scale ${isPositive ? 'result-positive' : 'result-negative'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: '3rem' }}>{isPositive ? '⚠️' : '✅'}</div>
        <div>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem', color: isPositive ? '#f38ba8' : '#a6e3a1' }}>
            {result.result}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Model: {result.model} v{result.version}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className={`badge badge-${result.risk_level === 'High' ? 'danger' : result.risk_level === 'Moderate' ? 'warning' : 'success'}`}>
            {result.risk_level} Risk
          </span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Confidence Score</span>
          <span style={{ fontWeight: 700, color: riskColor }}>{result.confidence}%</span>
        </div>
        <div className="confidence-bar">
          <div className="confidence-fill" style={{ width: `${result.confidence}%`, background: isPositive ? 'linear-gradient(90deg, #f38ba8, #e85d8a)' : 'linear-gradient(90deg, #a6e3a1, #3dc96a)' }} />
        </div>
      </div>

      {/* Processing time */}
      {result.processingTime && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          ⚡ Prediction computed in {result.processingTime}ms
        </p>
      )}

      {isPositive && (
        <div style={{ background: 'rgba(243,139,168,0.08)', border: '1px solid rgba(243,139,168,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: '#f5c2e7' }}>
          ⚕️ <strong>Medical Disclaimer:</strong> This is an AI-based prediction for informational purposes only. Please consult a qualified healthcare professional for diagnosis and treatment.
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={handleDownloadPDF} className="btn btn-secondary">
          📄 Download PDF Report
        </button>
        <button onClick={onReset} className="btn btn-outline">
          🔄 New Prediction
        </button>
      </div>
    </div>
  )
}
