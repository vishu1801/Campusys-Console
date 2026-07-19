import { createContext, useContext, useState, type ReactNode } from 'react'
import { getCurrentUser, login as loginRequest, type CurrentUser } from '../api/auth'

interface AuthContextValue {
  token: string | null
  user: CurrentUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(false)

  async function login(username: string, password: string) {
    setLoading(true)
    try {
      const { token: newToken } = await loginRequest({ username, password })
      localStorage.setItem('token', newToken)
      setToken(newToken)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
