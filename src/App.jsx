import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Favorites } from './pages/Favorites'
import { Cart } from './pages/Cart'
import { Orders } from './pages/Orders'
import { OrderDetail } from './pages/OrderDetail'
import { Profile } from './pages/Profile'
import { Notifications } from './pages/Notifications'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminProducts } from './pages/AdminProducts'
import { AdminProductForm } from './pages/AdminProductForm'
import { AdminCategories } from './pages/AdminCategories'
import { AdminUsers } from './pages/AdminUsers'
import { AdminOrders } from './pages/AdminOrders'

function App() {
  const guard = (page) => <ProtectedRoute>{page}</ProtectedRoute>
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
                <Route path="/" element={guard(<Products />)} />
                <Route path="/product/:id" element={guard(<ProductDetail />)} />
                <Route path="/favorites" element={guard(<Favorites />)} />
                <Route path="/cart" element={guard(<Cart />)} />
                <Route path="/orders" element={guard(<Orders />)} />
                <Route path="/orders/:id" element={guard(<OrderDetail />)} />
                <Route path="/profile" element={guard(<Profile />)} />
                <Route path="/notifications" element={guard(<Notifications />)} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
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
