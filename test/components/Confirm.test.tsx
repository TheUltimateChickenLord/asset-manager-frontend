import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Confirm from '../../src/components/Confirm'

describe('Confirm Dialog', () => {
  const onCloseMock = vi.fn()
  const action = 'Delete'
  const childrenText = 'Are you sure you want to delete this item?'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and content', () => {
    render(
      <Confirm open={true} action={action} onClose={onCloseMock}>
        {childrenText}
      </Confirm>,
    )

    expect(screen.getByText(`Confirm ${action}`)).toBeInTheDocument()
    expect(screen.getByText(childrenText)).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText(action)).toBeInTheDocument()
  })

  it('calls onClose(false) when cancel button is clicked', () => {
    render(
      <Confirm open={true} action={action} onClose={onCloseMock}>
        {childrenText}
      </Confirm>,
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(onCloseMock).toHaveBeenCalledWith(false)
  })

  it('calls onClose(true) when confirm button is clicked', () => {
    render(
      <Confirm open={true} action={action} onClose={onCloseMock}>
        {childrenText}
      </Confirm>,
    )

    fireEvent.click(screen.getByText(action))
    expect(onCloseMock).toHaveBeenCalledWith(true)
  })

  it('calls onClose(false) when dialog is closed via backdrop', () => {
    render(
      <Confirm open={true} action={action} onClose={onCloseMock}>
        {childrenText}
      </Confirm>,
    )

    fireEvent.keyDown(document.activeElement || document.body, {
      key: 'Escape',
      code: 'Escape',
    })

    screen.getByText('Cancel').closest('button')?.click()
    expect(onCloseMock).toHaveBeenCalledWith(false)
  })
})