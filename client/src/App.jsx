import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import FormBuilder from './pages/admin/FormBuilder'
import FormResponses from './pages/admin/FormResponses'

// Public pages
import FormView from './pages/public/FormView'
import ThankYou from './pages/public/ThankYou'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form/:slug" element={<FormView />} />
          <Route path="/thank-you/:responseId" element={<ThankYou />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/new"
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/:id"
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms/:id/responses"
            element={
              <ProtectedRoute>
                <FormResponses />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
