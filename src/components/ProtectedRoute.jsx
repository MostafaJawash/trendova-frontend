import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export function ProtectedRoute({ children }) { const { user } = useAuth(); const location = useLocation(); return user ? children : <Navigate replace to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} /> }
