import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LinkedRow from '../../src/components/LinkedRow'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()
const mockUnlinkAssets = vi.fn()
const mockHasRoleAccess = vi.fn((..._args) => true)
const mockTrigger = vi.fn()

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 1, roles: ['LinkAsset'], labels: [] } }),
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  useNavigate: () => mockNavigate,
}))

vi.mock('../../src/hooks/useConfirm', () => ({
  default: () => [false, vi.fn(), vi.fn()],
}))

vi.mock('../../src/api/assets', () => ({
  unlinkAssets: (...args: any[]) => mockUnlinkAssets(...args),
}))

vi.mock('../../src/utils/role_utils', () => ({
  hasRoleAccess: (...args: any[]) => mockHasRoleAccess(...args),
}))

describe('LinkedRow', () => {
  const asset = {
    id: 1,
    linked_assets: [
      { id: 10, asset_id: 1, linked_id: 2, relation: 'License' },
      { id: 11, asset_id: 1, linked_id: 3, relation: 'Peripheral' },
    ],
  } as any

  const assets = [
    { id: 1, asset_tag: 'A1', labels: [] },
    { id: 2, asset_tag: 'A2', labels: [] },
    { id: 3, asset_tag: 'A3', labels: [] },
  ] as any

  it('renders only linked assets for the given relation', () => {
    render(
      <MemoryRouter>
        <LinkedRow asset={asset} relation="License" assets={assets} trigger={mockTrigger} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Licenses:')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.queryByText('#3')).not.toBeInTheDocument()
  })

  it('navigates to asset detail on chip click', () => {
    render(
      <MemoryRouter>
        <LinkedRow asset={asset} relation="License" assets={assets} trigger={mockTrigger} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('#2'))
    expect(mockNavigate).toHaveBeenCalledWith('/assets/2')
  })

  it('does not render if no linked assets for relation', () => {
    const { container } = render(
      <MemoryRouter>
        <LinkedRow asset={asset} relation="Consumable" assets={assets} trigger={mockTrigger} />
      </MemoryRouter>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  // it('shows ConfirmAlert if user has role access', () => {
  //   render(
  //     <MemoryRouter>
  //       <LinkedRow asset={asset} relation="License" assets={assets} trigger={mockTrigger} />
  //     </MemoryRouter>
  //   )

  //   expect(screen.getByText(/Unlink Assets/)).toBeInTheDocument()
  // })

  // it('calls unlinkAssets when handleConfirmDeleteLink is called with confirm=true', async () => {
  //   render(
  //     <MemoryRouter>
  //       <LinkedRow asset={asset} relation="License" assets={assets} trigger={mockTrigger} />
  //     </MemoryRouter>
  //   )

  //   const chipLabel = screen.getByText('#2')
  //   fireEvent.click(chipLabel)
  // })
})