import { useEffect, useState } from 'react'
import Confirm from './Confirm'
import PopupAlert from './PopupAlert'

export default function ConfirmAlert({
  action,
  confirmMessage,
  popupMessageSuccess,
  popupMessageFailure,
  open,
  onClose,
  onComplete,
  closePopup,
}: {
  action: string
  confirmMessage: string
  popupMessageSuccess: string
  popupMessageFailure: string
  open: boolean
  onClose: (confirm: boolean) => Promise<boolean>
  onComplete: (success: boolean) => void
  closePopup: () => void
}) {
  const [status, setStatus] = useState<'success' | 'failure'>('success')
  const [openWindow, setOpenWindow] = useState(0)

  useEffect(() => {
    if (open && openWindow == 0) setOpenWindow(1)
  }, [open, openWindow])

  const handleConfirmClose = (confirm: boolean) => {
    onClose(confirm)
      .then((status) => setStatus(status ? 'success' : 'failure'))
      .catch(() => setStatus('failure'))
      .finally(() => {
        if (confirm) setOpenWindow(2)
        else {
          setOpenWindow(0)
          closePopup()
        }
      })
  }

  const handleAlertClose = () => {
    setOpenWindow(0)
    closePopup()
    onComplete(status == 'success')
  }

  return (
    <>
      <Confirm
        action={action}
        open={openWindow == 1}
        onClose={handleConfirmClose}
      >
        {confirmMessage}
      </Confirm>
      <PopupAlert
        status={status}
        title={action}
        open={openWindow == 2}
        onClose={handleAlertClose}
      >
        {status == 'success' ? popupMessageSuccess : popupMessageFailure}
      </PopupAlert>
    </>
  )
}
