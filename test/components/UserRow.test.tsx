import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserRow from '../../src/components/UserRow'
import { MemoryRouter } from 'react-router-dom'
import { User } from '../../src/api/interfaces'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe('UserRow Component', () => {
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    is_disabled: true,
    is_deleted: false,
    created_at: '2026-01-01T00:00:00Z',
    reset_password: false,
    labels: [],
    roles: []
  }

  it('renders user data correctly', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={mockUser} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('1/1/2026')).toBeInTheDocument()
  })

  it('renders user data correctly with inverted values', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={{...mockUser, is_disabled: false, is_deleted: true}} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('1/1/2026')).toBeInTheDocument()
  })

  it('uses correct chip colors', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={mockUser} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const yesChip = screen.getByText("Yes")
    const noChip = screen.getByText("No")

    expect(yesChip).toBeInTheDocument()
    expect(noChip).toBeInTheDocument()
    expect(yesChip).toAppearBefore(noChip)

    expect(yesChip.closest('div')).toHaveClass('MuiChip-colorError')
    expect(noChip.closest('div')).toHaveClass('MuiChip-colorPrimary')
  })

  it('navigates to user details on row click', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={mockUser} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('John Doe'))
    expect(mockNavigate).toHaveBeenCalledWith('/users/1')
  })
})