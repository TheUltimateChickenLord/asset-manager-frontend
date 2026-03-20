import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runFetch } from '../../src/utils/fetch_utils'

describe('runFetch', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('calls fetch with Authorization header when JWT exists', async () => {
    const mockJwt = 'test-jwt'
    localStorage.setItem('jwt', mockJwt)

    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await runFetch('/api/test')

    expect(fetchMock).toHaveBeenCalledWith('/api/test', {
      headers: { Authorization: `Bearer ${mockJwt}` },
    })
  })

  it('calls fetch without Authorization if JWT is missing', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await runFetch('/api/test')

    expect(fetchMock).toHaveBeenCalledWith('/api/test', { headers: {} })
  })

  it('preserves existing headers', async () => {
    localStorage.setItem('jwt', 'jwt123')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const init = { headers: { 'Content-Type': 'application/json' } }
    await runFetch('/api/test', init)

    expect(fetchMock).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt123',
      },
    })
  })

  it('does not mutate the original init object', async () => {
    localStorage.setItem('jwt', 'jwt123')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const init = { headers: { 'X-Test': '123' } }
    const initCopy = { ...init, headers: { ...init.headers } }

    await runFetch('/api/test', init)

    expect(init).toEqual(initCopy)
  })
})
