import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PopupAlert from '../../src/components/PopupAlert'

describe('PopupAlert', () => {
  const title = 'Test Alert'
  const message = 'This is a test message'
  let onClose: any

  beforeEach(() => {
    onClose = vi.fn()
  })

  it('renders with title and message', () => {
    render(
      <PopupAlert
        status="success"
        title={title}
        open={true}
        onClose={onClose}
      >
        {message}
      </PopupAlert>,
    )

    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('sets button color to primary on success', () => {
    render(
      <PopupAlert
        status="success"
        title={title}
        open={true}
        onClose={onClose}
      >
        {message}
      </PopupAlert>,
    )

    const button = screen.getByRole('button', { name: /close/i })
    expect(button).toHaveClass('MuiButton-colorPrimary', { exact: false })
  })

  it('sets button color to error on failure', () => {
    render(
      <PopupAlert
        status="failure"
        title={title}
        open={true}
        onClose={onClose}
      >
        {message}
      </PopupAlert>,
    )

    const button = screen.getByRole('button', { name: /close/i })
    expect(button).toHaveClass('MuiButton-colorError', { exact: false })
  })

  it('calls onClose when Close button is clicked', () => {
    render(
      <PopupAlert
        status="success"
        title={title}
        open={true}
        onClose={onClose}
      >
        {message}
      </PopupAlert>,
    )

    const button = screen.getByRole('button', { name: /close/i })
    fireEvent.click(button)
    expect(onClose).toHaveBeenCalled()
  })
})