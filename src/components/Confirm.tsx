import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import type { ReactNode } from 'react'

export default function Confirm({
  action,
  children,
  open,
  onClose,
}: {
  action: string
  children: ReactNode
  open: boolean
  onClose: (confirm: boolean) => void
}) {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Confirm {action}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="error">
          Cancel
        </Button>
        <Button onClick={() => onClose(true)}>{action}</Button>
      </DialogActions>
    </Dialog>
  )
}
