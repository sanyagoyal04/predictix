import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import HeartPredictor from './pages/HeartPredictor'
import DiabetesPredictor from './pages/DiabetesPredictor'
import BreastPredictor from './pages/BreastPredictor'
import LungPredictor from './pages/LungPredictor'
import History from './pages/History'
import About from './pages/About'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner spinner-lg" /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/predict/heart" element={<ProtectedRoute><HeartPredictor /></ProtectedRoute>} />
          <Route path="/predict/diabetes" element={<ProtectedRoute><DiabetesPredictor /></ProtectedRoute>} />
          <Route path="/predict/breast" element={<ProtectedRoute><BreastPredictor /></ProtectedRoute>} />
          <Route path="/predict/lung" element={<ProtectedRoute><LungPredictor /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
