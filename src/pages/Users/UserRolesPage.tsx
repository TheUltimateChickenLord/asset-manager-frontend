import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Chip,
  Autocomplete,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUserById } from '../../api/users'
import { getLabels } from '../../api/labels'
import useAsync from '../../hooks/useAsync'
import NotFound from '../Errors/NotFound'
import Unauthorized from '../Errors/Unauthorized'
import {
  hasRoleAccessString,
  hasScopeAll,
  labelsFromRoles,
} from '../../utils/role_utils'
import { useHistory } from '../../hooks/useHistory'
import { assignRole, removeRole } from '../../api/roles'

async function loadData(id: number) {
  return await Promise.all([getUserById(id), getLabels()])
}

export default function UserRolesPage() {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedScope, setSelectedScope] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, error, loadingData] = useAsync(
    useCallback(() => loadData(Number(id!)), [id]),
  )

  useEffect(() => {
    if (data)
      setUserRoles(data[0].roles.map((role) => role.role + ': ' + role.scope))
  }, [data])

  if (loadingData) return <></>
  if (!data) return <NotFound />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const [targetUser, allLabels] = data
  const availableRoles = [...new Set(user!.roles.map((role) => role.role))]
  const availableScopes = hasScopeAll(user!, selectedRole)
    ? allLabels.map((label) => label.name).concat('*')
    : labelsFromRoles(user!, selectedRole).map((role) => role.scope)

  if (targetUser.id == user!.id) return <Unauthorized />

  const handleAddRole = async () => {
    if (!selectedRole || !selectedScope) return
    if (!hasRoleAccessString(user!, selectedRole, [selectedScope])) {
      alert('You do not have permission to assign this role.')
      return
    }

    setLoading(true)
    try {
      await assignRole(Number(id!), selectedRole, selectedScope)
      setUserRoles((prev) => [...prev, selectedRole + ': ' + selectedScope])
      setSelectedRole('')
      setSelectedScope('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (role: string) => {
    setLoading(true)
    try {
      const [roleName, scope] = [
        role.split(': ')[0],
        role.split(': ').slice(1).join(': '),
      ]
      await removeRole(Number(id!), roleName, scope)
      setUserRoles((prev) => prev.filter((r) => r != role))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Manage Roles for {targetUser.email}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
        {userRoles.map((role) => (
          <Chip
            key={role}
            label={role}
            onDelete={
              hasRoleAccessString(user!, role.split(': ')[0], [
                role.split(': ').slice(1).join(': '),
              ])
                ? () => handleDeleteRole(role)
                : undefined
            }
            color="primary"
          />
        ))}
      </Box>

      <Box display="flex" gap={2} alignItems="top" mb={2}>
        <TextField
          select
          label="Role"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value)
            setSelectedScope('')
          }}
          sx={{ flex: 1 }}
          disabled={loading}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          options={availableScopes}
          value={selectedScope}
          onChange={(_e, value) => setSelectedScope(value || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Scope"
              helperText={!selectedRole && 'Select a Role first'}
            />
          )}
          sx={{ flex: 1 }}
          disabled={loading || !selectedRole}
        />
      </Box>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          disabled={!selectedRole || !selectedScope || loading}
          onClick={handleAddRole}
        >
          Add Role
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={prevPage || `/users/${id!}`}
        >
          Back
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Paper>
  )
}
