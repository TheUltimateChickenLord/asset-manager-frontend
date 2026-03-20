import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RequestRow from '../../src/components/RequestRow'
import { MemoryRouter } from 'react-router-dom'
import { Request } from '../../src/api/interfaces'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe('RequestRow Component', () => {
  const mockRequest: Request = {
    id: 101,
    asset: {
      asset_tag: 'A-123', name: 'Laptop',
      id: 0,
      description: '',
      labels: []
    },
    status: 'Approved',
    requested_at: '2026-01-01T12:00:00Z',
    user: {
      email: 'user@example.com',
      id: 0,
      name: ''
    },
    user_id: 0,
    asset_id: 0,
    justification: '',
    approved_by: null,
    approver: null,
    assignment: null
  }

  it('renders request data correctly', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <RequestRow request={mockRequest} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    expect(screen.getByText('A-123')).toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
    expect(screen.getByText('1/1/2026')).toBeInTheDocument() // locale format may vary
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
  })

  it('uses correct chip color for status', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <RequestRow request={mockRequest} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const chip = screen.getByText('Approved')
    expect(chip).toBeInTheDocument()
    expect(chip.closest('div')).toHaveClass('MuiChip-colorSuccess')
  })

  it('navigates to request details on row click', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <RequestRow request={mockRequest} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('A-123'))
    expect(mockNavigate).toHaveBeenCalledWith('/requests/101')
  })
})