import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthContext, useAuth } from '../../src/hooks/useAuth'

describe('AuthContext / useAuth', () => {
  it('should return default values when no provider is used', async () => {
    const { result } = renderHook(() => useAuth())

    const { user, login, logout } = result.current

    expect(user).toBeNull()

    await expect(login('test', 'test')).resolves.toBe(false)
    await expect(logout()).resolves.toBeUndefined()
  })

  it('should use values from AuthContext provider', async () => {
    const mockUser = { id: 1, name: 'John' } as any

    const login = vi.fn().mockResolvedValue(true)
    const logout = vi.fn().mockResolvedValue(undefined)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: mockUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBe(mockUser)

    await act(async () => {
      const res = await result.current.login('user', 'pass')
      expect(res).toBe(true)
    })

    expect(login).toHaveBeenCalledWith('user', 'pass')

    await act(async () => {
      await result.current.logout()
    })

    expect(logout).toHaveBeenCalled()
  })
})