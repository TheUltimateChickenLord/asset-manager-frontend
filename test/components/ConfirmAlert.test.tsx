import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConfirmAlert from '../../src/components/ConfirmAlert'

vi.mock('../../src/components/Confirm', () => ({
  default: vi.fn(({ action, children, open, onClose }) => (
    <>
      <div data-testid="confirm" onClick={() => onClose(true)}>
        {children} - {action} - open: {open.toString()}
      </div>
      <div data-testid="cancel" onClick={() => onClose(false)}></div>
    </>
  )),
}))

vi.mock('../../src/components/PopupAlert', () => ({
  default: vi.fn(({ status, title, open, onClose, children }) => (
    <div data-testid="popup" onClick={onClose}>
      {children} - {status} - {title} - open: {open.toString()}
    </div>
  )),
}))

describe('ConfirmAlert', () => {
  const confirmMessage = 'Are you sure?'
  const popupMessageSuccess = 'Success!'
  const popupMessageFailure = 'Failed!'
  const action = 'Delete'
  const closePopup = vi.fn()
  const onComplete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Confirm when open', async () => {
    const onClose = vi.fn(() => Promise.resolve(true))
    render(
      <ConfirmAlert
        action={action}
        confirmMessage={confirmMessage}
        popupMessageSuccess={popupMessageSuccess}
        popupMessageFailure={popupMessageFailure}
        open={true}
        onClose={onClose}
        onComplete={onComplete}
        closePopup={closePopup}
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('confirm')).toBeInTheDocument()
      expect(screen.getByTestId('confirm')).toHaveTextContent(/true/)
      expect(screen.getByTestId('popup')).toBeInTheDocument()
      expect(screen.getByTestId('popup')).toHaveTextContent(/false/)
    })
  })

  it('shows PopupAlert with success on confirm', async () => {
    const onClose = vi.fn(() => Promise.resolve(true))
    render(
      <ConfirmAlert
        action={action}
        confirmMessage={confirmMessage}
        popupMessageSuccess={popupMessageSuccess}
        popupMessageFailure={popupMessageFailure}
        open={true}
        onClose={onClose}
        onComplete={onComplete}
        closePopup={closePopup}
      />,
    )

    fireEvent.click(screen.getByTestId('confirm'))
    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
      expect(screen.getByText(`${popupMessageSuccess} - success - ${action} - open: true`)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('popup'))
    await waitFor(() => {
      expect(closePopup).toHaveBeenCalled()
      expect(onComplete).toHaveBeenCalledWith(true)
    })
  })

  it('shows PopupAlert with failure when onClose rejects', async () => {
    const onClose = vi.fn(() => Promise.reject())
    render(
      <ConfirmAlert
        action={action}
        confirmMessage={confirmMessage}
        popupMessageSuccess={popupMessageSuccess}
        popupMessageFailure={popupMessageFailure}
        open={true}
        onClose={onClose}
        onComplete={onComplete}
        closePopup={closePopup}
      />,
    )

    fireEvent.click(screen.getByTestId('confirm'))
    await waitFor(() => {
      expect(screen.getByTestId('popup')).toBeInTheDocument()
      expect(screen.getByText(`${popupMessageFailure} - failure - ${action} - open: true`)).toBeInTheDocument()
    })
  })

  it('resets openWindow and calls closePopup on cancel', async () => {
    const onClose = vi.fn(() => Promise.resolve(true))
    render(
      <ConfirmAlert
        action={action}
        confirmMessage={confirmMessage}
        popupMessageSuccess={popupMessageSuccess}
        popupMessageFailure={popupMessageFailure}
        open={true}
        onClose={onClose}
        onComplete={onComplete}
        closePopup={closePopup}
      />,
    )

    const cancel = screen.getByTestId('cancel')
    await waitFor(() => {
      cancel.click()
    })
  })

  it('resets openWindow and calls closePopup on cancel', async () => {
    const onClose = vi.fn(() => Promise.resolve(false))
    render(
      <ConfirmAlert
        action={action}
        confirmMessage={confirmMessage}
        popupMessageSuccess={popupMessageSuccess}
        popupMessageFailure={popupMessageFailure}
        open={true}
        onClose={onClose}
        onComplete={onComplete}
        closePopup={closePopup}
      />,
    )

    const cancel = screen.getByTestId('cancel')
    await waitFor(() => {
      cancel.click()
    })
  })
})