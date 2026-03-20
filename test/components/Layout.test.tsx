import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Layout from '../../src/components/Layout'
import { MemoryRouter } from 'react-router-dom'

const mockLogout = vi.fn(() => Promise.resolve())
const mockNavigate = vi.fn()
const mockToggleTheme = vi.fn()

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 1, email: 'test@test.com', roles: ['ReadAsset', 'ReadUser', 'CheckInOutAsset'] }, logout: mockLogout }),
}))

vi.mock('../../src/hooks/useThemeMode', () => ({
  useThemeMode: () => ({ mode: 'light', toggleTheme: mockToggleTheme }),
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  Outlet: () => <div data-testid="outlet" />,
}))

vi.mock('../../src/utils/role_utils', () => ({
  hasRole: (user: any, role: string) => user.roles.includes(role),
}))

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AppBar with nav items based on roles', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    expect(screen.getByText('Asset Manager')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Assignments')).toBeInTheDocument()
    expect(screen.queryByText('Requests')).toBeInTheDocument()
  })

  it('toggles theme when icon button clicked', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    const themeButton = screen.getByRole('button', { name: /Theme/i })
    fireEvent.click(themeButton)
    expect(mockToggleTheme).toHaveBeenCalled()
  })

  it('calls logout and navigate on Logout button click', async () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    const logoutButton = screen.getAllByText('Logout')[0]
    fireEvent.click(logoutButton)
    expect(mockLogout).toHaveBeenCalled()
    await Promise.resolve()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('renders Outlet', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('opens and closes drawer', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )

    const menuButton = screen.getByRole('button', { name: '' })
    fireEvent.click(menuButton)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
    expect(within(screen.getByRole('presentation')).getByText('Dashboard')).toBeInTheDocument()

    fireEvent.click(within(screen.getByRole('presentation')).getByText('Dashboard'))
  })
})