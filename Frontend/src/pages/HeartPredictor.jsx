import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import PredictionResult from '../components/PredictionResult'

const FIELDS = [
  { name: 'age', label: 'Age', type: 'number', placeholder: '55', min: 1, max: 120 },
  { name: 'sex', label: 'Sex', type: 'select', options: [{ value: 1, label: 'Male' }, { value: 0, label: 'Female' }] },
  { name: 'cp', label: 'Chest Pain Type', type: 'select', options: [{ value: 0, label: '0 - Typical Angina' }, { value: 1, label: '1 - Atypical Angina' }, { value: 2, label: '2 - Non-anginal Pain' }, { value: 3, label: '3 - Asymptomatic' }] },
  { name: 'trestbps', label: 'Resting BP (mmHg)', type: 'number', placeholder: '120', min: 50, max: 250 },
  { name: 'chol', label: 'Serum Cholesterol (mg/dl)', type: 'number', placeholder: '200', min: 50, max: 700 },
  { name: 'fbs', label: 'Fasting Blood Sugar > 120mg/dl', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  { name: 'restecg', label: 'Resting ECG Results', type: 'select', options: [{ value: 0, label: '0 - Normal' }, { value: 1, label: '1 - ST-T Wave Abnormality' }, { value: 2, label: '2 - Left Ventricular Hypertrophy' }] },
  { name: 'thalach', label: 'Max Heart Rate Achieved', type: 'number', placeholder: '150', min: 50, max: 250 },
  { name: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }] },
  { name: 'oldpeak', label: 'ST Depression (Oldpeak)', type: 'number', placeholder: '1.0', min: 0, max: 10, step: 0.1 },
  { name: 'slope', label: 'Peak Exercise ST Slope', type: 'select', options: [{ value: 0, label: '0 - Upsloping' }, { value: 1, label: '1 - Flat' }, { value: 2, label: '2 - Downsloping' }] },
  { name: 'ca', label: 'Major Vessels Colored (0–3)', type: 'select', options: [0, 1, 2, 3].map(v => ({ value: v, label: String(v) })) },
  { name: 'thal', label: 'Thalassemia', type: 'select', options: [{ value: 0, label: '0 - Normal' }, { value: 1, label: '1 - Fixed Defect' }, { value: 2, label: '2 - Reversible Defect' }, { value: 3, label: '3 - Unknown' }] },
]

const DEFAULT_FORM = { age: '', sex: 1, cp: 0, trestbps: '', chol: '', fbs: 0, restecg: 0, thalach: '', exang: 0, oldpeak: '', slope: 0, ca: 0, thal: 0 }

export default function HeartPredictor() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [predictionId, setPredictionId] = useState(null)

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? e.target.value : Number(e.target.value)
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]))
      const { data } = await api.post('/predictions/predict/heart', payload)
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
    setForm({ age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1 })
    toast.success('Sample data filled!')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <div className="disease-icon" style={{ background: 'rgba(243,139,168,0.15)', fontSize: '2rem' }}>❤️</div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.75rem' }}>Heart Disease Predictor</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Algorithm: Logistic Regression · 13 Clinical Features</p>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 32 }} />

      {result ? (
        <PredictionResult result={result} disease="heart" predictionId={predictionId} onReset={() => { setResult(null); setForm(DEFAULT_FORM) }} />
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700 }}>Patient Data</h2>
            <button onClick={fillSample} className="btn btn-secondary btn-sm">📋 Fill Sample</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
              {FIELDS.map((f) => (
                <div className="form-group" key={f.name}>
                  <label className="form-label" htmlFor={`heart-${f.name}`}>{f.label}</label>
                  {f.type === 'select' ? (
                    <select id={`heart-${f.name}`} name={f.name} className="form-input form-select" value={form[f.name]} onChange={handleChange}>
                      {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input id={`heart-${f.name}`} type="number" name={f.name} className="form-input"
                      placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                      min={f.min} max={f.max} step={f.step || 1} required />
                  )}
                </div>
              ))}
            </div>

            <button type="submit" id="heart-predict-btn" className="btn btn-primary" disabled={loading} style={{ minWidth: 200 }}>
              {loading ? <><span className="spinner" />Analyzing...</> : '🔬 Predict Heart Disease'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
