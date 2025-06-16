import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import type { ReactNode } from 'react'

export default function PopupAlert({
  status,
  title,
  children,
  open,
  onClose,
}: {
  status: 'success' | 'failure'
  title: string
  children: ReactNode
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color={status == 'success' ? 'primary' : 'error'}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
