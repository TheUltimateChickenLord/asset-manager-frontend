import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AssetRow from '../../src/components/AssetRow'
import { useNavigate } from 'react-router-dom'
import { getDueDateInfo } from '../../src/utils/date_utils'
import type { Asset } from '../../src/api/interfaces'

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

describe('AssetRow', () => {
  const navigateMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as any).mockReturnValue(navigateMock)
  })

  const asset: Asset = {
    id: 1,
    asset_tag: 'A123',
    name: 'Laptop',
    status: 'Available',
    purchase_date: '2023-01-01T00:00:00.000Z',
    purchase_cost: 1200,
    last_maintenance: '2023-06-01T00:00:00.000Z',
    maintenance_rate: 180,
    description: '',
    created_at: '',
    is_deleted: false,
    linked_assets: [],
    linked_to: [],
    labels: []
  }

  it('renders all cells correctly', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Due Soon', days: 30 })

    render(<AssetRow asset={asset} />)

    expect(screen.getByText(asset.asset_tag)).toBeInTheDocument()
    expect(screen.getByText(asset.name)).toBeInTheDocument()
    expect(screen.getByText(asset.status)).toBeInTheDocument()
    expect(screen.getByText('1/1/2023')).toBeInTheDocument()
    expect(screen.getByText('£1200.00')).toBeInTheDocument()
    expect(screen.getByText('6/1/2023')).toBeInTheDocument()
    expect(screen.getByText('Due Soon')).toBeInTheDocument()
  })

  it('falls back on purchase_date if last_maintenance is null', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Due Soon', days: 30 })

    render(<AssetRow asset={{...asset, last_maintenance: null}} />)

    expect(screen.getByText('1/1/2023')).toBeInTheDocument()
    expect(screen.queryByText('6/1/2023')).not.toBeInTheDocument()
  })

  it('applies correct status chip color', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'OK', days: 100 })

    render(<AssetRow asset={asset} />)

    const statusChip = screen.getByText(asset.status)
    expect(statusChip.closest('div')).toHaveClass('MuiChip-colorSuccess')
  })

  it('applies correct due-date chip color based on days', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'Overdue', days: -5 })

    render(<AssetRow asset={asset} />)

    const dueChip = screen.getByText('Overdue')
    expect(dueChip.closest('div')).toHaveClass('MuiChip-colorError')
  })

  it('navigates on row click', () => {
    ;(getDueDateInfo as any).mockReturnValue({ message: 'OK', days: 100 })

    render(<AssetRow asset={asset} />)

    const row = screen.getByRole('row')
    fireEvent.click(row)

    expect(navigateMock).toHaveBeenCalledWith(`/assets/${asset.id}`)
  })
})