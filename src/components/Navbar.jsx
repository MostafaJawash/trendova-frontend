/* oxlint-disable react(set-state-in-effect) */
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { count } = useCart()
  const [unread, setUnread] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { setUnread(0); return undefined }
    let active = true
    const refresh = () => api('GET', '/notifications', { query: { unread: true, page: 1, limit: 1 } }).then((result) => { if (active) setUnread(result.total || 0) }).catch(() => {})
    refresh()
    const interval = window.setInterval(refresh, 60000)
    return () => { active = false; window.clearInterval(interval) }
  }, [user])

  const handleLogout = async () => { await logout(); navigate('/login') }
  return <header className="navbar"><Link className="brand" to="/">Trendova</Link><nav>{user ? <><Link to="/cart">السلة <b className="counter">{count}</b></Link><Link to="/notifications">الإشعارات <b className="counter">{unread}</b></Link><Link to="/profile">{user.name}</Link>{isAdmin && <Link to="/admin">الإدارة</Link>}<button type="button" className="button--text" onClick={handleLogout}>تسجيل الخروج</button></> : <><Link to="/login">تسجيل الدخول</Link><Link to="/register">حساب جديد</Link></>}</nav></header>
}
