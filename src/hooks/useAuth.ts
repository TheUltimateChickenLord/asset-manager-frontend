import { createContext, useContext } from 'react'
import type { User } from '../api/interfaces'

export const AuthContext = createContext<{
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}>({
  user: null,
  login: async (_username: string, _password: string) => false,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)
