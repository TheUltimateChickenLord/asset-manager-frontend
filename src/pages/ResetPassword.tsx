import { useState } from 'react'
import {
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material'
import PasswordField from '../components/PasswordField'
import { resetPasswordSelf } from '../api/users'
import { verifyPasswordComplexity } from '../utils/auth_utils'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import useConfirm from '../hooks/useConfirm'
import ConfirmAlert from '../components/ConfirmAlert'

const ResetPassword = () => {
  const { user, logout, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm_password: '' })
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {}
    if (!verifyPasswordComplexity(form.password))
      errors.password =
        'Password must be 8 characters and including upercase, lowercase, numbers and a special character'
    if (form.password != form.confirm_password)
      errors.confirm_password = "Passwords don't match"
    setError(errors)
    if (Object.keys(errors).length > 0) return

    setOpenConfirm()
  }

  const handleConfirmClose = async (confirm: boolean) => {
    if (!confirm) return true

    try {
      await resetPasswordSelf(form.password)
      return true
    } catch (e) {
      setError({ general: e as string })
      return false
    }
  }

  const onComplete = async () => {
    const email = user!.email
    await logout()
    await login(email, form.password)
    navigate('/')
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: '16px' }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" marginBottom={2}>
          Reset Password
        </Typography>
        <form action={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <PasswordField
                fullWidth
                form={form}
                setForm={setForm}
                error={!!error.password}
                helperText={error.password ?? ''}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <PasswordField
                fullWidth
                form={form}
                setForm={setForm}
                label="Confirm Password"
                name="confirm_password"
                error={!!error.confirm_password}
                helperText={error.confirm_password ?? ''}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button type="submit" fullWidth variant="contained">
                Reset
              </Button>
            </Grid>
            {error.general && <Alert severity="error">{error.general}</Alert>}
          </Grid>
        </form>
      </Paper>

      <ConfirmAlert
        action="Reset Password"
        open={openConfirm}
        confirmMessage="Are you sure you want to reset your password?"
        popupMessageSuccess="Password has been reset"
        popupMessageFailure="Could not reset password, try again later"
        onClose={handleConfirmClose}
        onComplete={onComplete}
        closePopup={setCloseConfirm}
      />
    </Container>
  )
}

export default ResetPassword
