import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentRow from '../../src/components/AssignmentRow'
import { useNavigate } from 'react-router-dom'
import { getDueDateInfo } from '../../src/utils/date_utils'
import { Assignment } from '../../src/api/interfaces'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

vi.mock('../../src/utils/date_utils', () => ({
  getDueDateInfo: vi.fn(),
}))

describe('AssignmentRow', () => {
  const navigateMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as any).mockReturnValue(navigateMock)
  })

  const assignment: Assignment = {
    id: 1,
    asset: {
      asset_tag: 'A123', name: 'Laptop',
      id: 0,
      description: '',
      status: 'Available',
      purchase_date: '',
      purchase_cost: 0,
      created_at: '',
      last_maintenance: null,
      maintenance_rate: 0,
      is_deleted: false,
      linked_assets: [],
      linked_to: [],
      labels: []
    },
    user: {
      email: 'user@test.com',
      id: 0,
      name: ''
    },
    assigned_by: {
      email: 'admin@test.com',
      id: 0,
      name: ''
    },
    assigned_at: '2023-01-01T00:00:00.000Z',
    due_date: '2023-12-31T00:00:00.000Z',
    returned_at: null,
    asset_id: 0,
    user_id: 0,
    assigned_by_id: 0,
    request_id: null
  }

  it('renders all cells correctly', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Due Soon', days: 5 })

    render(<AssignmentRow assignment={assignment} />)

    expect(screen.getByText('A123')).toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('user@test.com')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
    expect(screen.getByText('1/1/2023')).toBeInTheDocument()
    expect(screen.getByText('Due Soon')).toBeInTheDocument()
    expect(screen.queryByText(/2023/)).not.toBeNull()
  })

  it('applies correct chip color for days <= 0 (error)', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Overdue', days: -1 })
    render(<AssignmentRow assignment={assignment} />)
    const chip = screen.getByText('Overdue')
    expect(chip.closest('div')).toHaveClass('MuiChip-colorError')
  })

  it('applies correct chip color for 0 < days <= 7 (warning)', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Due Soon', days: 5 })
    render(<AssignmentRow assignment={assignment} />)
    const chip = screen.getByText('Due Soon')
    expect(chip.closest('div')).toHaveClass('MuiChip-colorWarning')
  })

  it('applies correct chip color for days > 7 (info)', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'OK', days: 30 })
    render(<AssignmentRow assignment={assignment} />)
    const chip = screen.getByText('OK')
    expect(chip.closest('div')).toHaveClass('MuiChip-colorInfo')
  })

  it('applies correct chip color for returned item (success)', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'OK', days: -1 })
    render(<AssignmentRow assignment={{...assignment, returned_at: '2024-01-01T00:00:00.000Z'}} />)
    const chip = screen.getByText('OK')
    expect(chip.closest('div')).toHaveClass('MuiChip-colorSuccess')
    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
  })

  it('navigates to assignment details on row click', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'OK', days: 30 })
    render(<AssignmentRow assignment={assignment} />)

    fireEvent.click(screen.getByRole('row'))
    expect(navigateMock).toHaveBeenCalledWith(`/assignments/${assignment.id}`)
  })
})