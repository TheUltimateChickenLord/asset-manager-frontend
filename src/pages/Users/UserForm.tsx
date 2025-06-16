import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Alert,
  Box,
  Paper,
} from '@mui/material'
import type { Label } from '../../api/interfaces'
import useAsync from '../../hooks/useAsync'
import { getLabels } from '../../api/labels'
import { useAuth } from '../../hooks/useAuth'
import PasswordField from '../../components/PasswordField'
import { createUser } from '../../api/users'
import { verifyPasswordComplexity } from '../../utils/auth_utils'
import { hasScopeAll } from '../../utils/role_utils'
import { useHistory } from '../../hooks/useHistory'
import ConfirmAlert from '../../components/ConfirmAlert'
import useConfirm from '../../hooks/useConfirm'
import { validate } from 'email-validator'

interface FormValues {
  name: string
  email: string
  password: string
  confirm_password: string
  labels: Label[]
}

const UserForm = () => {
  const prevPage = useHistory()
  const { user } = useAuth()
  const [all_labels] = useAsync(getLabels, [])
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    labels: [],
  })
  const navigate = useNavigate()
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [isPending, setIsPending] = useState(false)
  const [id, setId] = useState<number | null>(null)

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {}
    if (formValues.labels.length == 0)
      errors.label = 'At least one label must be selected'
    if (!verifyPasswordComplexity(formValues.password))
      errors.password =
        'Password must be 8 characters and including upercase, lowercase, numbers and a special character'
    if (formValues.password != formValues.confirm_password)
      errors.confirm_password = "Passwords don't match"
    if (!validate(formValues.email)) errors.email = 'Invalid email'

    setError(errors)
    if (Object.keys(errors).length > 0) return

    setOpenConfirm()
  }

  const handleConfirmClose = async (confirm: boolean) => {
    if (!confirm) return true
    setIsPending(true)

    try {
      const result = await createUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        labels: formValues.labels.map((label) => label.name),
      })
      setId(result.id)
      setIsPending(false)

      return true
    } catch (e) {
      setIsPending(false)
      setError({ general: e as string })
      return false
    }
  }

  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((formValues) => ({
      ...formValues,
      [event.target.name]: event.target.value,
    }))
  }
  const handleLabelChange = (_: SyntheticEvent, value: Label[]) => {
    setFormValues((formValues) => ({ ...formValues, labels: value }))
  }

  const canEditAll = hasScopeAll(user!, 'CreateEditUser')
  const userRoles = user?.roles
    .filter((role) => role.role == 'CreateEditUser')
    .map((role) => all_labels?.find((label) => label.name == role.scope))
    .filter((role) => role != undefined)

  return (
    <Container>
      <Paper sx={{ p: 4, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          New User
        </Typography>
        <form action={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            name="name"
            value={formValues.name}
            onChange={updateForm}
            required
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            name="email"
            value={formValues.email}
            onChange={updateForm}
            error={!!error.email}
            helperText={error.email ?? ''}
            required
          />
          <PasswordField
            fullWidth
            margin="normal"
            form={formValues}
            setForm={setFormValues}
            error={!!error.password}
            helperText={error.password ?? ''}
          />
          <PasswordField
            fullWidth
            margin="normal"
            form={formValues}
            setForm={setFormValues}
            label="Confirm Password"
            name="confirm_password"
            error={!!error.confirm_password}
            helperText={error.confirm_password ?? ''}
          />
          <Autocomplete
            multiple
            options={canEditAll ? all_labels! : userRoles!}
            getOptionLabel={(option: Label) => option.name}
            onChange={handleLabelChange}
            value={formValues.labels}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Labels"
                margin="normal"
                error={!!error.label}
                helperText={error.label ?? ''}
              />
            )}
          />
          <Box mt={2} display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={isPending}>
              Create User
            </Button>
            <Button
              variant="outlined"
              color="error"
              component={Link}
              to={prevPage || '/users'}
            >
              Cancel
            </Button>
          </Box>
          {error.general && <Alert severity="error">{error.general}</Alert>}
        </form>

        <ConfirmAlert
          action="Create User"
          open={openConfirm}
          confirmMessage="Are you sure you want to create a user with these values?"
          popupMessageSuccess="User successfully created"
          popupMessageFailure="Could not create user, try again later"
          onClose={handleConfirmClose}
          onComplete={() => navigate(`/users/${id!}`)}
          closePopup={setCloseConfirm}
        />
      </Paper>
    </Container>
  )
}

export default UserForm
