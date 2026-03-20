import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ItemList from '../../src/components/ItemList'
import { MemoryRouter } from 'react-router-dom'

describe('ItemList', () => {
  const title = 'Asset'
  const filter = <div data-testid="filter">Filter Component</div>
  const children = <tr data-testid="row"><td>Row 1</td></tr>
  const onPageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and new button when newButton=true', () => {
    render(
      <MemoryRouter>
        <ItemList
          title={title}
          filter={filter}
          newButton={true}
          count={5}
          page={0}
          onPageChange={onPageChange}
        >
          {children}
        </ItemList>
      </MemoryRouter>,
    )

    expect(screen.getByText(`${title} List`)).toBeInTheDocument()
    expect(screen.getByText(`New ${title}`)).toBeInTheDocument()
    expect(screen.getByTestId('filter')).toBeInTheDocument()
    expect(screen.getByTestId('row')).toBeInTheDocument()
  })

  it('does not render new button when newButton=false', () => {
    render(
      <MemoryRouter>
        <ItemList
          title={title}
          filter={filter}
          newButton={false}
          count={5}
          page={0}
          onPageChange={onPageChange}
        >
          {children}
        </ItemList>
      </MemoryRouter>,
    )

    expect(screen.queryByText(`New ${title}`)).not.toBeInTheDocument()
  })

  it('renders pagination when count > 10 and calls onPageChange', () => {
    render(
      <MemoryRouter>
        <ItemList
          title={title}
          filter={filter}
          newButton={true}
          count={25}
          page={0}
          onPageChange={onPageChange}
        >
          {children}
        </ItemList>
      </MemoryRouter>,
    )

    const nextPageButton = screen.getByLabelText('Go to next page')
    expect(nextPageButton).toBeInTheDocument()

    fireEvent.click(nextPageButton)
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('renders children in the table', () => {
    render(
      <MemoryRouter>
        <ItemList
          title={title}
          filter={filter}
          newButton={true}
          count={5}
          page={0}
          onPageChange={onPageChange}
        >
          {children}
        </ItemList>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('row')).toBeInTheDocument()
  })
})