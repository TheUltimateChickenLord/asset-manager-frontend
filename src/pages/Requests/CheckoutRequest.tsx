import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { checkOutAssetByRequest } from '../../api/assignments'
import useConfirm from '../../hooks/useConfirm'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'

interface ErrorList {
  dueInDays?: string
}

export default function CheckOutRequestPage() {
  const prevPage = useHistory()
  const { id } = useParams()
  const navigate = useNavigate()
  const [dueInDays, setDueInDays] = useState('')
  const [errors, setErrors] = useState<ErrorList>({})
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()

  const handleConfirm = async (confirm: boolean) => {
    if (confirm) {
      try {
        await checkOutAssetByRequest(Number(id!), parseInt(dueInDays))
      } catch {
        return false
      }
    }
    return true
  }

  const validate = () => {
    const newErrors: ErrorList = {}
    if (!dueInDays || isNaN(parseInt(dueInDays)) || parseInt(dueInDays) <= 0) {
      newErrors.dueInDays = 'Enter a positive number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setOpenConfirm()
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Check Out Asset
      </Typography>
      <form action={handleSubmit} noValidate>
        <TextField
          label="Due in Days"
          type="text"
          value={dueInDays}
          onChange={(e) => setDueInDays(e.target.value.replace(/\D/g, ''))}
          error={!!errors.dueInDays}
          helperText={errors.dueInDays}
          margin="normal"
          fullWidth
        />
        <Box mt={2} display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Check Out
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={prevPage || `/requests/${id!}`}
          >
            Back
          </Button>
        </Box>
      </form>

      <ConfirmAlert
        action="Check Out"
        open={openConfirm}
        confirmMessage={`Are you sure you want to check out this request?`}
        popupMessageSuccess="Request successfully checked out"
        popupMessageFailure="Could not check out request, try again later"
        onClose={handleConfirm}
        onComplete={() => navigate(`/requests/${id}`)}
        closePopup={setCloseConfirm}
      />
    </Paper>
  )
}
