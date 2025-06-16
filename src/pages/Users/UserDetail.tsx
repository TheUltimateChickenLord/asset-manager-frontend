import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  Alert,
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { hasRoleAccess } from '../../utils/role_utils'
import useConfirm from '../../hooks/useConfirm'
import {
  deleteUser,
  disableUser,
  enableUser,
  getUserById,
  resetPasswordUser,
} from '../../api/users'
import NotFound from '../Errors/NotFound'
import { useCallback, useState } from 'react'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'

const UserDetail = () => {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loadedUser, error, loading, triggerReload] = useAsync(
    useCallback(() => getUserById(Number(id!)), [id]),
  )
  const [openConfirmDelete, setOpenConfirmDelete, setCloseConfirmDelete] =
    useConfirm()
  const [openConfirmReset, setOpenConfirmReset, setCloseConfirmReset] =
    useConfirm()
  const [openConfirmActive, setOpenConfirmActive, setCloseConfirmActive] =
    useConfirm()
  const [password, setPassword] = useState('')

  const handleConfirmCloseDelete = async (confirm: boolean) => {
    if (confirm) {
      try {
        await deleteUser(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }
  const handleConfirmCloseReset = async (confirm: boolean) => {
    if (confirm) {
      try {
        const password = await resetPasswordUser(Number(id!))
        setPassword(password)
      } catch {
        return false
      }
    }
    return true
  }
  const handleConfirmCloseActive = async (confirm: boolean) => {
    if (confirm) {
      try {
        if (loadedUser!.is_disabled) await enableUser(Number(id!))
        else await disableUser(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }

  if (loading) return <></>
  if (!loadedUser) return <NotFound />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {loadedUser.name}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Email:</Typography>
            <Typography>{loadedUser.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Disabled?:</Typography>
            <Chip
              label={loadedUser.is_disabled ? 'Yes' : 'No'}
              color={loadedUser.is_disabled ? 'error' : 'primary'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Deleted?:</Typography>
            <Chip
              label={loadedUser.is_deleted ? 'Yes' : 'No'}
              color={loadedUser.is_deleted ? 'error' : 'primary'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Created At:</Typography>
            <Typography>
              {new Date(loadedUser.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">
              Password Reset On Next Login:
            </Typography>
            <Chip
              label={loadedUser.reset_password ? 'Yes' : 'No'}
              color={loadedUser.reset_password ? 'error' : 'primary'}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Labels:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {loadedUser.labels.map((label) => (
                <Chip key={label.id} label={label.name} color="default" />
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Roles:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {loadedUser.roles.map((role) => (
                <Chip
                  key={role.role + role.scope}
                  label={role.role + ': ' + role.scope}
                  color="default"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
        {!loadedUser.is_deleted && loadedUser.id != user!.id && (
          <>
            {hasRoleAccess(user!, 'DeleteUser', loadedUser.labels) &&
              !loadedUser.is_deleted && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={setOpenConfirmDelete}
                >
                  Delete User
                </Button>
              )}
            {hasRoleAccess(user!, 'DisableUser', loadedUser.labels) && (
              <Button
                variant="contained"
                color="error"
                onClick={setOpenConfirmActive}
              >
                {loadedUser!.is_disabled ? 'Enable' : 'Disable'} User
              </Button>
            )}
            {hasRoleAccess(user!, 'ResetPasswordUser', loadedUser.labels) && (
              <Button
                variant="contained"
                color="primary"
                onClick={setOpenConfirmReset}
              >
                Reset Password
              </Button>
            )}
            {hasRoleAccess(user!, 'CreateEditUser', loadedUser.labels) && (
              <Button
                variant="outlined"
                color="info"
                component={Link}
                to="labels"
              >
                Add Labels
              </Button>
            )}
            {hasRoleAccess(user!, 'CreateEditUser', loadedUser.labels) && (
              <Button
                variant="outlined"
                color="info"
                component={Link}
                to="roles"
              >
                Add Roles
              </Button>
            )}
          </>
        )}
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={prevPage || '/users'}
        >
          Back
        </Button>
      </Box>

      <ConfirmAlert
        action="Delete"
        open={openConfirmDelete}
        confirmMessage="Are you sure you want to delete this user? This action cannot be undone."
        popupMessageSuccess="User successfully deleted"
        popupMessageFailure="Could not delete user, try again later"
        onClose={handleConfirmCloseDelete}
        onComplete={() => navigate('/users')}
        closePopup={setCloseConfirmDelete}
      />
      <ConfirmAlert
        action="Reset Password"
        open={openConfirmReset}
        confirmMessage="Are you sure you want to reset this user's password? This action cannot be undone. The next time this user logs in they will be prompted to change this password."
        popupMessageSuccess={`The password has been successfully reset. Do not forget this password. ${password}`}
        popupMessageFailure="Could not delete user, try again later"
        onClose={handleConfirmCloseReset}
        onComplete={() => {
          setPassword('')
          triggerReload()
        }}
        closePopup={setCloseConfirmReset}
      />
      <ConfirmAlert
        action={loadedUser.is_deleted ? 'Enable User' : 'Disable User'}
        open={openConfirmActive}
        confirmMessage={`Are you sure you want to ${
          loadedUser.is_deleted ? 'enable' : 'disable'
        } this user? This action is temporary and can be reversed.`}
        popupMessageSuccess={`The user has been successfully ${
          loadedUser.is_deleted ? 'enabled' : 'disabled'
        }.`}
        popupMessageFailure={`Could not ${
          loadedUser.is_deleted ? 'enable' : 'disable'
        } user, try again later`}
        onClose={handleConfirmCloseActive}
        onComplete={triggerReload}
        closePopup={setCloseConfirmActive}
      />
    </Box>
  )
}

export default UserDetail
