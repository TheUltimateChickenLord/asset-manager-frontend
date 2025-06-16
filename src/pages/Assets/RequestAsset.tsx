import { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useConfirm from '../../hooks/useConfirm'
import { submitRequest } from '../../api/requests'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'

export default function RequestAssetPage() {
  const prevPage = useHistory()
  const { id } = useParams()
  const navigate = useNavigate()
  const [justification, setJustification] = useState('')
  const [error, setError] = useState<string>('')
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()

  const handleSubmit = async (confirm: boolean) => {
    if (confirm) {
      try {
        await submitRequest(Number(id!), justification)
      } catch (error) {
        setError(error as string)
        return false
      }
    }
    return true
  }

  return (
    <>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Request an Asset
        </Typography>
        <form action={setOpenConfirm}>
          <TextField
            label="Justification"
            multiline
            rows={4}
            fullWidth
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            margin="normal"
            required
          />

          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" type="submit" fullWidth>
              Submit Request
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={prevPage || `/assets/${id!}`}
            >
              Back
            </Button>
          </Box>
        </form>
      </Paper>

      <ConfirmAlert
        action="Submit"
        open={openConfirm}
        confirmMessage="Are you sure you want to submit this request?"
        popupMessageSuccess="Request submitted"
        popupMessageFailure={error}
        onClose={handleSubmit}
        onComplete={() => navigate(`/assets/${id}`)}
        closePopup={setCloseConfirm}
      />
    </>
  )
}
