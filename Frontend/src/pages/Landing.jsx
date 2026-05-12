import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DISEASES = [
  { id: 'heart', emoji: '❤️', label: 'Heart Disease', algo: 'Logistic Regression', color: 'var(--color-heart)', grad: 'var(--grad-heart)', desc: 'Predict risk of coronary artery disease using 13 clinical parameters.' },
  { id: 'diabetes', emoji: '🩸', label: 'Diabetes', algo: 'Support Vector Machine', color: 'var(--color-diabetes)', grad: 'var(--grad-diabetes)', desc: 'Detect diabetes risk using glucose levels and metabolic markers.' },
  { id: 'breast', emoji: '🎗️', label: 'Breast Cancer', algo: 'Convolutional Neural Network', color: 'var(--color-breast)', grad: 'var(--grad-breast)', desc: 'Classify histopathology images as benign or malignant.' },
  { id: 'lung', emoji: '🫁', label: 'Lung Cancer', algo: 'InceptionResNetV2', color: 'var(--color-lung)', grad: 'var(--grad-lung)', desc: 'Analyze chest X-rays using deep transfer learning.' },
]

const STATS = [
  { value: '4', label: 'ML Models', icon: '🤖' },
  { value: '95%+', label: 'Accuracy', icon: '🎯' },
  { value: '< 3s', label: 'Prediction Time', icon: '⚡' },
  { value: 'PDF', label: 'Report Export', icon: '📄' },
]

const FEATURES = [
  { icon: '🔐', title: 'Secure Auth', desc: 'JWT-protected routes with encrypted passwords' },
  { icon: '🐍', title: 'Child Process ML', desc: 'Python models invoked via Node.js child processes' },
  { icon: '📊', title: 'Prometheus Metrics', desc: 'Real-time monitoring of prediction counts & latency' },
  { icon: '🐳', title: 'Docker Ready', desc: 'Full containerization with Docker Compose' },
  { icon: '🔄', title: 'CI/CD Pipeline', desc: 'Automated testing and deployment via GitHub Actions' },
  { icon: '📱', title: 'PDF Reports', desc: 'Download detailed prediction reports as PDF' },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80 }}>
        <div className="hero-bg" />
        {/* Animated orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(137,180,250,0.06) 0%, transparent 70%)', top: '10%', right: '5%', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(203,166,247,0.05) 0%, transparent 70%)', bottom: '15%', left: '5%', animation: 'float 8s ease-in-out infinite reverse' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-fade-in">
              <span className="section-tag">🧠 AI-Powered Healthcare</span>
            </div>
            <h1 className="animate-fade-in" style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginTop: 20,
              animationDelay: '0.1s',
            }}>
              Predict Disease with
              <span className="text-gradient" style={{ display: 'block' }}>Machine Intelligence</span>
            </h1>
            <p className="animate-fade-in" style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              marginTop: 20,
              lineHeight: 1.7,
              animationDelay: '0.2s',
            }}>
              PredictiX leverages state-of-the-art ML models — Logistic Regression, SVM, CNN, and InceptionResNetV2 —
              to predict heart disease, diabetes, breast and lung cancer with clinical-grade accuracy.
            </p>
            <div className="animate-fade-in flex" style={{ gap: 16, justifyContent: 'center', marginTop: 36, animationDelay: '0.3s' }}>
              <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg">
                {isAuthenticated ? '🔬 Go to Dashboard' : '🚀 Get Started Free'}
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-mantle)' }}>
        <div className="container">
          <div className="grid-4">
            {STATS.map((s, i) => (
              <div key={i} className="animate-fade-in" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disease Predictors ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Disease Predictors</span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: 12 }}>
              Four Powerful AI Models
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Each predictor uses a specialized algorithm trained on clinical datasets.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            {DISEASES.map((d, i) => (
              <div key={d.id} className="card animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, borderRadius: '0 0 0 120px', background: d.grad, opacity: 0.08 }} />
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div className="disease-icon" style={{ background: `${d.color}20`, fontSize: '1.75rem' }}>{d.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.125rem', marginBottom: 4 }}>{d.label}</h3>
                    <span style={{ fontSize: '0.75rem', color: d.color, fontWeight: 600, background: `${d.color}15`, padding: '2px 10px', borderRadius: 'var(--radius-full)', border: `1px solid ${d.color}40` }}>{d.algo}</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 10, lineHeight: 1.5 }}>{d.desc}</p>
                    <Link to={isAuthenticated ? `/predict/${d.id}` : '/signup'}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 16, borderColor: d.color + '60', color: d.color }}>
                      Predict Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-mantle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">DevOps + AI</span>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginTop: 12 }}>
              Production-Grade Infrastructure
            </h2>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(137,180,250,0.08), rgba(203,166,247,0.08))',
            border: '1px solid rgba(137,180,250,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 32px',
          }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Ready to Get Your Health Prediction?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: '1.0625rem' }}>
              Create a free account and get instant AI-powered disease risk assessments.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Start for Free</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '32px 0', background: 'var(--bg-mantle)' }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.125rem' }}>
            Predic<span className="text-gradient">tiX</span>
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © 2025 PredictiX. For educational purposes only. Not a substitute for medical advice.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>About</Link>
            <a href="https://github.com" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
