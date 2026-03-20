import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivateRoute from '../../src/components/PrivateRoute'
import { useAuth } from '../../src/hooks/useAuth'
import { hasRole } from '../../src/utils/role_utils'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/hooks/useAuth')
vi.mock('../../src/utils/role_utils')

const MockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>
const MockHasRole = hasRole as unknown as ReturnType<typeof vi.fn>

describe('PrivateRoute', () => {
  const logoutMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('redirects to login if no user', () => {
    MockUseAuth.mockReturnValue({ user: null, logout: logoutMock })
    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>,
    )
    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('logs out and redirects if login expired', () => {
    MockUseAuth.mockReturnValue({ user: { id: 1 }, logout: logoutMock })
    const pastDate = new Date(Date.now() - 1000).toISOString()
    localStorage.setItem('login expiry', pastDate)

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(logoutMock).toHaveBeenCalled()
    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('redirects to reset-password if reset_password is true', () => {
    MockUseAuth.mockReturnValue({ user: { id: 1, reset_password: true }, logout: logoutMock })
    localStorage.setItem('login expiry', new Date(Date.now() + 10000).toISOString())

    // Mock location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    })

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  })

  it('renders Unauthorized if roles do not match', () => {
    MockUseAuth.mockReturnValue({ user: { id: 1 }, logout: logoutMock })
    localStorage.setItem('login expiry', new Date(Date.now() + 10000).toISOString())
    MockHasRole.mockReturnValue(false)

    render(
      <MemoryRouter>
        <PrivateRoute roles={[['Admin']]} >
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText(/not authorized/i)).toBeInTheDocument()
  })

  it('renders children if authorized', () => {
    MockUseAuth.mockReturnValue({ user: { id: 1 }, logout: logoutMock })
    localStorage.setItem('login expiry', new Date(Date.now() + 10000).toISOString())
    MockHasRole.mockReturnValue(true)

    render(
      <MemoryRouter>
        <PrivateRoute roles={[['Admin']]} >
          <div>Protected</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Protected')).toBeInTheDocument()
  })
})