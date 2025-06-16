import { useState, type ReactNode } from 'react'
import { loginUser, logoutUser } from '../api/auth'
import type { User } from '../api/interfaces'
import { AuthContext } from '../hooks/useAuth'
import { addDays } from '../utils/date_utils'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )

  const login = async (username: string, password: string) => {
    const user = await loginUser(username, password)
    localStorage.setItem('login expiry', addDays(new Date(), 1).toISOString())
    if (user) {
      setUser(user)
      return true
    }
    return false
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('login expiry')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
