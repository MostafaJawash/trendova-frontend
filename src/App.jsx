import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthenticatedHome } from './pages/AuthenticatedHome'

function App() {
  const protectedPage = <ProtectedRoute><AuthenticatedHome /></ProtectedRoute>
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={protectedPage} />
                <Route path="/product/:id" element={protectedPage} />
                <Route path="/favorites" element={protectedPage} />
                <Route path="/cart" element={protectedPage} />
                <Route path="/orders" element={protectedPage} />
                <Route path="/orders/:id" element={protectedPage} />
                <Route path="/profile" element={protectedPage} />
                <Route path="/notifications" element={protectedPage} />
                <Route path="/admin/*" element={<AdminRoute><AuthenticatedHome /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  )
}

export default App
