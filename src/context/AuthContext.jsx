/* oxlint-disable react(only-export-components) */
import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const token = localStorage.getItem('access_token')

  const storeSession = (result) => {
    localStorage.setItem('access_token', result.access_token)
    localStorage.setItem('user', JSON.stringify(result.user))
    setUser(result.user)
  }

  const value = useMemo(() => ({
    user,
    token,
    isAdmin: user?.role === 'admin',
    async login(credentials) {
      const result = await api('POST', '/auth/login', { json: credentials })
      storeSession(result)
      return result.user
    },
    async register(data) {
      await api('POST', '/auth/register', { json: data })
      const result = await api('POST', '/auth/login', {
        json: { email: data.email, password: data.password },
      })
      storeSession(result)
      return result.user
    },
    async logout() {
      try {
        await api('POST', '/auth/logout')
      } catch {
        // Clearing local session is required even if the server is unavailable.
      } finally {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setUser(null)
      }
    },
    async refreshUser() {
      const currentUser = await api('GET', '/auth/me')
      localStorage.setItem('user', JSON.stringify(currentUser))
      setUser(currentUser)
      return currentUser
    },
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
