import { act, render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from '../../src/context/AuthContext'
import { AuthContext } from '../../src/hooks/useAuth'
import { loginUser, logoutUser } from '../../src/api/auth'
import { addDays } from '../../src/utils/date_utils'

vi.mock('../../src/api/auth', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
}))

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides user from localStorage initially', () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' }
    localStorage.setItem('user', JSON.stringify(mockUser))

    let contextValue: any
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    )

    expect(contextValue.user).toEqual(mockUser)
  })

  it('login sets user and localStorage on success', async () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' }
    ;(loginUser as any).mockResolvedValue(mockUser)

    let contextValue: any
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    )

    const result = await act(() => contextValue.login('alice', 'password'))
    expect(result).toBe(true)
    await waitFor(() => expect(contextValue.user).toEqual(mockUser))

    const expiry = new Date(localStorage.getItem('login expiry')!)
    const tomorrow = addDays(new Date(), 1)
    expect(Math.abs(expiry.getTime() - tomorrow.getTime())).toBeLessThan(1000)
  })

  it('login returns false when user is null', async () => {
    ;(loginUser as any).mockResolvedValue(null)

    let contextValue: any
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    )

    const result = await act(() => contextValue.login('bob', 'wrong'))
    expect(result).toBe(false)
    expect(contextValue.user).toBeNull()
  })

  it('logout clears user and localStorage', async () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' }
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('login expiry', new Date().toISOString())
    ;(logoutUser as any).mockResolvedValue(undefined)

    let contextValue: any
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value
            return null
          }}
        </AuthContext.Consumer>
      </AuthProvider>,
    )

    await act(() => contextValue.logout())
    await waitFor(() => {
      expect(contextValue.user).toBeNull()
      expect(localStorage.getItem('login expiry')).toBeNull()
    })
  })
})
