export class ApiError extends Error {
  constructor(status, payload = {}, retryAfter = null) {
    super(payload.message || 'حدث خطأ غير متوقع')
    this.name = 'ApiError'
    this.status = status
    this.code = payload.code || null
    this.details = payload.details || []
    this.retryAfter = retryAfter
  }
}

function clearSessionAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  const next = `${window.location.pathname}${window.location.search}`
  window.location.hash = `/login?next=${encodeURIComponent(next)}`
}

export async function api(method, path, options = {}) {
  const { query, json, formData } = options
  const search = new URLSearchParams()
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      search.set(key, value)
    }
  })

  const token = localStorage.getItem('access_token')
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (json) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`/api/v1${path}${search.size ? `?${search}` : ''}`, {
      method,
      headers,
      body: json ? JSON.stringify(json) : formData,
    })
  } catch {
    throw new ApiError(0, { message: 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.' })
  }

  if (response.status === 204) return null
  const payload = await response.json().catch(() => ({}))
  if (response.ok) return payload

  const retryAfter = Number(response.headers.get('Retry-After')) || null
  const error = new ApiError(response.status, payload.error, retryAfter)
  if (response.status === 401 && path !== '/auth/login') clearSessionAndRedirect()
  throw error
}
