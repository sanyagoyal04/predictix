import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import PredictionResult from '../components/PredictionResult'

const FIELDS = [
  { name: 'Pregnancies', label: 'Pregnancies', type: 'number', placeholder: '1', min: 0, max: 20 },
  { name: 'Glucose', label: 'Glucose Level (mg/dL)', type: 'number', placeholder: '120', min: 0, max: 300 },
  { name: 'BloodPressure', label: 'Blood Pressure (mmHg)', type: 'number', placeholder: '80', min: 0, max: 200 },
  { name: 'SkinThickness', label: 'Skin Thickness (mm)', type: 'number', placeholder: '20', min: 0, max: 100 },
  { name: 'Insulin', label: 'Insulin Level (μU/mL)', type: 'number', placeholder: '100', min: 0, max: 1000 },
  { name: 'BMI', label: 'BMI (kg/m²)', type: 'number', placeholder: '25.0', min: 0, max: 100, step: 0.1 },
  { name: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function', type: 'number', placeholder: '0.5', min: 0, max: 3, step: 0.001 },
  { name: 'Age', label: 'Age (years)', type: 'number', placeholder: '35', min: 1, max: 120 },
]

const DEFAULT_FORM = { Pregnancies: '', Glucose: '', BloodPressure: '', SkinThickness: '', Insulin: '', BMI: '', DiabetesPedigreeFunction: '', Age: '' }

export default function DiabetesPredictor() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [predictionId, setPredictionId] = useState(null)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]))
      const { data } = await api.post('/predictions/predict/diabetes', payload)
      setResult(data)
      setPredictionId(data.predictionId)
      toast.success('Prediction complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const fillSample = () => {
    setForm({ Pregnancies: 6, Glucose: 148, BloodPressure: 72, SkinThickness: 35, Insulin: 0, BMI: 33.6, DiabetesPedigreeFunction: 0.627, Age: 50 })
    toast.success('Sample data filled!')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <div className="disease-icon" style={{ background: 'rgba(250,179,135,0.15)' }}>🩸</div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Diabetes Predictor</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Algorithm: Support Vector Machine (SVM) · 8 Metabolic Features</p>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 32 }} />

      {result ? (
        <PredictionResult result={result} disease="diabetes" predictionId={predictionId} onReset={() => { setResult(null); setForm(DEFAULT_FORM) }} />
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700 }}>Metabolic Data</h2>
            <button onClick={fillSample} className="btn btn-secondary btn-sm">📋 Fill Sample</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
              {FIELDS.map((f) => (
                <div className="form-group" key={f.name}>
                  <label className="form-label" htmlFor={`diab-${f.name}`}>{f.label}</label>
                  <input id={`diab-${f.name}`} type="number" name={f.name} className="form-input"
                    placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                    min={f.min} max={f.max} step={f.step || 1} required />
                </div>
              ))}
            </div>
            <button type="submit" id="diabetes-predict-btn" className="btn btn-primary" disabled={loading} style={{ minWidth: 200 }}>
              {loading ? <><span className="spinner" />Analyzing...</> : '🔬 Predict Diabetes'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
