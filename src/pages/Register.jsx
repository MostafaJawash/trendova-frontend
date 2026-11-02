import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { FormField } from '../components/FormField'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  if (user) return <Navigate replace to="/" />
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.password.length < 8) nextErrors.password = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'كلمتا المرور غير متطابقتين.'
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setErrors({}); setSubmitting(true)
    try { await register({ name: form.name, email: form.email, password: form.password }); navigate('/', { replace: true }) }
    catch (reason) { setErrors(reason instanceof ApiError && reason.status === 409 ? { email: reason.message } : { form: reason.message }) }
    finally { setSubmitting(false) }
  }
  return <section className="auth-card"><h1>إنشاء حساب</h1><form onSubmit={submit}><FormField label="الاسم" value={form.name} onChange={update('name')} autoComplete="name" required /><FormField label="البريد الإلكتروني" type="email" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" required /><FormField label="كلمة المرور" type="password" value={form.password} onChange={update('password')} error={errors.password} autoComplete="new-password" required /><FormField label="تأكيد كلمة المرور" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" required />{errors.form && <p className="form-error">{errors.form}</p>}<button type="submit" disabled={submitting}>{submitting ? 'جارٍ إنشاء الحساب…' : 'إنشاء الحساب'}</button></form></section>
}
