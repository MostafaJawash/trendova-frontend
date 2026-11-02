import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
export function AdminRoute({ children }) { const { user, isAdmin } = useAuth(); const toast = useToast(); useEffect(() => { if (user && !isAdmin) toast('ليس لديك صلاحية الوصول إلى هذه الصفحة', 'error') }, [isAdmin, toast, user]); if (!user) return <Navigate replace to="/login" />; return isAdmin ? children : <Navigate replace to="/" /> }
