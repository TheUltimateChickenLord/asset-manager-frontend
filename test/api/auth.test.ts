import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  loginUser,
  logoutUser,
} from '../../src/api/auth'

vi.mock('../../src/utils/fetch_utils')

const mockedRunFetch = vi.mocked(fetchUtils.runFetch)

describe('Auth API service', () => {
  const BASE = 'http://localhost:8000'

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('loginUser success', async () => {
    mockedRunFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ access_token: 'jwt-token' }),
    } as any)

    mockedRunFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
    } as any)

    const result = await loginUser('alice', 'password')

    expect(result).toEqual({ id: 1, name: 'Alice' })
    expect(localStorage.getItem('jwt')).toBe('jwt-token')
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 1, name: 'Alice' }))

    expect(mockedRunFetch).toHaveBeenCalledWith(
      `${BASE}/token/`,
      expect.objectContaining({ method: 'POST' }),
    )
    expect(mockedRunFetch).toHaveBeenCalledWith(
      `${BASE}/api/users/me/`,
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('loginUser fails with bad credentials', async () => {
    mockedRunFetch.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ detail: 'Invalid credentials' }),
    } as any)

    const result = await loginUser('alice', 'wrongpass')
    expect(result).toBeNull()
    expect(localStorage.getItem('jwt')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('loginUser fails due to fetch error', async () => {
    mockedRunFetch.mockRejectedValueOnce(new Error('Network error'))
    const result = await loginUser('alice', 'password')
    expect(result).toBeNull()
    expect(localStorage.getItem('jwt')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('logoutUser clears localStorage', async () => {
    localStorage.setItem('jwt', 'jwt-token')
    localStorage.setItem('user', JSON.stringify({ id: 1 }))

    await logoutUser()

    expect(localStorage.getItem('jwt')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('logoutUser does not fail on no login', async () => {
    localStorage.clear()

    await logoutUser()

    expect(localStorage.getItem('jwt')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})