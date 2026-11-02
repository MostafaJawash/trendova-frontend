import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { FormField } from '../components/FormField'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const next = new URLSearchParams(location.search).get('next') || '/'

  useEffect(() => { if (!seconds) return undefined; const interval = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(interval) }, [seconds])
  if (user) return <Navigate replace to="/" />

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await login({ email, password }); navigate(next, { replace: true }) }
    catch (reason) { setError(reason.message); if (reason instanceof ApiError && reason.status === 429) setSeconds(reason.retryAfter || 60) }
    finally { setSubmitting(false) }
  }

  return <section className="auth-card"><h1>تسجيل الدخول</h1><p>أدخل بيانات حسابك للمتابعة.</p><form onSubmit={submit}><FormField label="البريد الإلكتروني" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /><FormField label="كلمة المرور" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />{error && <p className="form-error">{error}</p>}{seconds > 0 && <p className="form-error">حاول مجدداً بعد {seconds} ثانية.</p>}<button type="submit" disabled={submitting || seconds > 0}>{submitting ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}</button></form></section>
}
