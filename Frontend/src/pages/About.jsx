const TEAM = [
  { name: 'ML Pipeline', role: 'Logistic Regression · SVM · CNN · InceptionResNetV2', emoji: '🧠' },
  { name: 'Backend API', role: 'Node.js · Express.js · MongoDB · Child Process', emoji: '⚙️' },
  { name: 'Frontend', role: 'React + Vite · Context API · Recharts', emoji: '🎨' },
  { name: 'DevOps', role: 'Docker · GitHub Actions · Prometheus · Grafana', emoji: '🚀' },
]

const TECH_STACK = [
  { label: 'React + Vite', desc: 'Fast frontend framework', color: '#61DAFB', icon: '⚛️' },
  { label: 'Node.js + Express', desc: 'REST API backend', color: '#68A063', icon: '🟢' },
  { label: 'MongoDB', desc: 'User & prediction storage', color: '#4DB33D', icon: '🍃' },
  { label: 'Python ML', desc: '4 specialized algorithms', color: '#3776AB', icon: '🐍' },
  { label: 'Docker', desc: 'Containerization', color: '#2496ED', icon: '🐳' },
  { label: 'Prometheus + Grafana', desc: 'Monitoring & metrics', color: '#E6522C', icon: '📊' },
  { label: 'GitHub Actions', desc: 'CI/CD automation', color: '#2088FF', icon: '🔄' },
  { label: 'jwt + bcrypt', desc: 'Secure authentication', color: '#F9E2AF', icon: '🔐' },
]

export default function About() {
  return (
    <div style={{ paddingTop: 32 }}>
      {/* Hero */}
      <section style={{ background: 'var(--bg-mantle)', padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag">Unit V — DevOps with AI</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: 16, lineHeight: 1.1 }}>
            About <span className="text-gradient">PredictiX</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 20, fontSize: '1.0625rem', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.7 }}>
            A Capstone Project 5 demonstrating DevOps + AI integration through a production-grade multi-disease prediction platform with full CI/CD, containerization, and monitoring.
          </p>
        </div>
      </section>

      {/* What We Built */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Project</span>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem', marginTop: 12 }}>What PredictiX Does</h2>
          </div>
          <div className="grid-2" style={{ gap: 24 }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🎯 Core Objective</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                PredictiX predicts four diseases — heart disease, diabetes, breast cancer, and lung cancer — using state-of-the-art machine learning algorithms. The platform demonstrates how AI models can be seamlessly integrated into a production environment with robust DevOps practices.
              </p>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🔬 ML Architecture</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20 }}>
                <li><strong style={{ color: '#f38ba8' }}>Heart Disease:</strong> Logistic Regression (13 features)</li>
                <li><strong style={{ color: '#fab387' }}>Diabetes:</strong> SVM with RBF Kernel (8 features)</li>
                <li><strong style={{ color: '#f5c2e7' }}>Breast Cancer:</strong> CNN (histopathology images)</li>
                <li><strong style={{ color: '#94e2d5' }}>Lung Cancer:</strong> InceptionResNetV2 (X-rays/CT)</li>
              </ul>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🐳 DevOps Pipeline</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20 }}>
                <li>Docker Compose for multi-service orchestration</li>
                <li>GitHub Actions CI/CD with automated testing</li>
                <li>Prometheus metrics collection from /metrics endpoint</li>
                <li>Grafana dashboards for real-time visualization</li>
                <li>Health check endpoints for all services</li>
              </ul>
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Advanced Features</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20 }}>
                <li>Node.js Child Process for Python model execution</li>
                <li>Prescription image upload with regex auto-fill</li>
                <li>Custom PDF report generation via pdf-lib</li>
                <li>Rate limiting and Helmet.js security headers</li>
                <li>JWT authentication with bcrypt password hashing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ background: 'var(--bg-mantle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Technology</span>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem', marginTop: 12 }}>Tech Stack</h2>
          </div>
          <div className="grid-4" style={{ gap: 16 }}>
            {TECH_STACK.map((t, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DevOps Flow */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">CI/CD Pipeline</span>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '2rem', marginTop: 12 }}>DevOps Workflow</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {[
              { step: '1', label: 'Code Push', icon: '📝', desc: 'Developer pushes to GitHub' },
              { step: '2', label: 'CI Trigger', icon: '🔄', desc: 'GitHub Actions activates' },
              { step: '3', label: 'Test & Lint', icon: '✅', desc: 'Automated tests run' },
              { step: '4', label: 'Docker Build', icon: '🐳', desc: 'Images built & tagged' },
              { step: '5', label: 'Push to Registry', icon: '📦', desc: 'GHCR image push' },
              { step: '6', label: 'Deploy', icon: '🚀', desc: 'Docker Compose deploy' },
              { step: '7', label: 'Monitor', icon: '📊', desc: 'Prometheus + Grafana' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="card" style={{ padding: '16px 20px', minWidth: 120, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
                {i < 6 && <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', flexShrink: 0 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
