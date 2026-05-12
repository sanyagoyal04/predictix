import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import PredictionResult from '../components/PredictionResult'

export default function LungPredictor() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [predictionId, setPredictionId] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please upload a chest X-ray or CT scan'); return }
    setLoading(true)
    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await api.post('/predictions/predict/lung', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(data)
      setPredictionId(data.predictionId)
      toast.success('Scan analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setFile(null); setPreview(null) }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <div className="disease-icon" style={{ background: 'rgba(148,226,213,0.15)' }}>🫁</div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Lung Cancer Detector</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Algorithm: InceptionResNetV2 (Transfer Learning) · Chest X-Ray / CT Scan</p>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 32 }} />

      {result ? (
        <PredictionResult result={result} disease="lung" predictionId={predictionId} onReset={reset} />
      ) : (
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Upload Chest X-Ray or CT Scan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
            Upload a chest X-ray or CT scan image. The InceptionResNetV2 deep learning model (pre-trained on ImageNet) will analyze it for lung cancer indicators.
          </p>

          <div style={{ background: 'rgba(148,226,213,0.08)', border: '1px solid rgba(148,226,213,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: '0.875rem', color: '#94e2d5' }}>
            🧠 <strong>Model:</strong> InceptionResNetV2 with fine-tuned classification head. Analyzes at 299×299 resolution.
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              id="lung-upload-zone"
            >
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" style={{ maxHeight: 220, maxWidth: '100%', borderRadius: 12, objectFit: 'contain', background: '#000' }} />
                  <p style={{ marginTop: 12, color: 'var(--accent-teal)', fontSize: '0.9rem' }}>{file.name}</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🫁</div>
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>Drop chest X-ray/CT scan here or click to browse</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Supports: JPG, PNG, DICOM-exported images · Max 10MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])} id="lung-file-input" />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="submit" id="lung-predict-btn" className="btn btn-primary" disabled={loading || !file} style={{ minWidth: 220 }}>
                {loading ? <><span className="spinner" />Analyzing scan...</> : '🔬 Detect Lung Cancer'}
              </button>
              {file && <button type="button" className="btn btn-secondary" onClick={reset}>Clear</button>}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
