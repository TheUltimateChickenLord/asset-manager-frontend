import { useState, type SyntheticEvent } from 'react'
import {
  Box,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Alert,
  Paper,
} from '@mui/material'
import useAsync from '../../hooks/useAsync'
import { getUsers } from '../../api/users'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { User } from '../../api/interfaces'
import { checkOutAsset } from '../../api/assignments'
import useConfirm from '../../hooks/useConfirm'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'

interface ErrorList {
  user?: string
  dueInDays?: string
}

export default function CheckOutAssetPage() {
  const prevPage = useHistory()
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [dueInDays, setDueInDays] = useState('')
  const [errors, setErrors] = useState<ErrorList>({})
  const [users, error, loading] = useAsync(getUsers)
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()

  const handleConfirm = async (confirm: boolean) => {
    if (confirm) {
      const payload = {
        asset_id: Number(id!),
        user_id: user!.id,
        due_in_days: parseInt(dueInDays),
      }
      try {
        await checkOutAsset(payload)
      } catch {
        return false
      }
    }
    return true
  }

  const validate = () => {
    const newErrors: ErrorList = {}
    if (!user) newErrors.user = 'User is required'
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

  const handleLabelChange = (_: SyntheticEvent, value: User | null) => {
    setUser(value)
  }

  if (loading || !users) return <></>
  if (error)
    return (
      <Alert severity="error">
        You do not have the role to list users. Please checkout items via their
        request or ask an administrator to update your roles.
      </Alert>
    )

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Check Out Asset
      </Typography>
      <form action={handleSubmit} noValidate>
        <Autocomplete
          options={users}
          getOptionLabel={(option: User) => option.email}
          value={user}
          onChange={handleLabelChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select User"
              error={!!errors.user}
              helperText={errors.user}
              margin="normal"
              fullWidth
            />
          )}
        />
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
            to={prevPage || `/assets/${id!}`}
          >
            Back
          </Button>
        </Box>
      </form>

      <ConfirmAlert
        action="Check Out"
        open={openConfirm}
        confirmMessage={`Are you sure you want to check out this asset to ${user?.email}?`}
        popupMessageSuccess="Asset successfully checked out"
        popupMessageFailure="Could not check out asset, try again later"
        onClose={handleConfirm}
        onComplete={() => navigate(`/assets/${id}`)}
        closePopup={setCloseConfirm}
      />
    </Paper>
  )
}
