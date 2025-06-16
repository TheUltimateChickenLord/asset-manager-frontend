import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Autocomplete,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Button,
  createFilterOptions,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import useAsync from '../../hooks/useAsync'
import {
  assignLabelUser,
  createLabel,
  deleteLabelUser,
  getLabels,
} from '../../api/labels'
import { useAuth } from '../../hooks/useAuth'
import { hasScopeAll, labelsFromRoles } from '../../utils/role_utils'
import { getUserById } from '../../api/users'
import NotFound from '../Errors/NotFound'
import Unauthorized from '../Errors/Unauthorized'
import { useHistory } from '../../hooks/useHistory'
import useConfirm from '../../hooks/useConfirm'
import ConfirmAlert from '../../components/ConfirmAlert'

const filter = createFilterOptions<string>()

export default function UserLabelsPage() {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const [userLabels, setUserLabels] = useState<string[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()
  const [allLabels, errorLabels, loadingLabels, trigger] = useAsync(getLabels)
  const [targetUser, errorUser, loadingUser] = useAsync(
    useCallback(() => getUserById(Number(id!)), [id]),
  )

  useEffect(() => {
    if (targetUser) setUserLabels(targetUser.labels.map((label) => label.name))
  }, [targetUser])

  const handleConfirmClose = async (confirm: boolean) => {
    if (!confirm) return true
    setLoading(true)

    try {
      await createLabel(selectedLabel!)
      setLoading(false)
      return true
    } catch (e) {
      setLoading(false)
      return false
    }
  }

  const handleAddLabel = async () => {
    if (!selectedLabel) return

    setLoading(true)
    try {
      const label = allLabels!.find((label) => label.name == selectedLabel)!.id
      await assignLabelUser(targetUser!.id, label)
      setUserLabels((prev) => [...prev, selectedLabel])
      setSelectedLabel(null)
    } catch (error) {
      console.error('Error assigning label:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveLabel = async (selectedLabel: string) => {
    setLoading(true)
    try {
      const label = allLabels!.find((label) => label.name == selectedLabel)!.id
      await deleteLabelUser(targetUser!.id, label)
      setUserLabels((prev) => prev.filter((l) => l != selectedLabel))
    } catch (error) {
      console.error('Error removing label:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loadingLabels || loadingUser) return <></>
  if (!targetUser) return <NotFound />
  if (targetUser.id == user!.id) return <Unauthorized />
  if (errorUser || errorLabels)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const availableLabels = hasScopeAll(user!, 'CreateEditUser')
    ? allLabels!.map((label) => label.name)
    : labelsFromRoles(user!, 'CreateEditUser').map((role) => role.scope)

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Manage Labels for {targetUser.email}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {userLabels.map((label) => (
          <Chip
            key={label}
            label={label}
            onDelete={() => handleRemoveLabel(label)}
            color="primary"
          />
        ))}
      </Box>

      <Autocomplete
        value={selectedLabel}
        onChange={(_e, value) => {
          if (
            value?.startsWith('Add ') &&
            allLabels!.find((label) => label.name == value) == undefined
          ) {
            setOpenConfirm()
            setSelectedLabel(value.slice(4))
          } else {
            setSelectedLabel(value)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params).filter(
            (label) => !userLabels.includes(label),
          )

          if (
            params.inputValue != '' &&
            !availableLabels.includes(params.inputValue.trim()) &&
            !userLabels.includes(params.inputValue.trim())
          ) {
            filtered.push(`Add ${params.inputValue.trim()}`)
          }

          return filtered
        }}
        options={availableLabels.filter(
          (l) => !userLabels.find((ul) => ul == l),
        )}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        freeSolo
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Label"
            placeholder="Search label"
            disabled={loading}
          />
        )}
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
      <Box mt={2} display="flex" gap={2}>
        <Button
          variant="outlined"
          color="info"
          onClick={handleAddLabel}
          disabled={
            loading ||
            loadingLabels ||
            !selectedLabel ||
            allLabels!.find((label) => label.name == selectedLabel) == undefined
          }
        >
          Add Label
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

      <ConfirmAlert
        action="Add Label"
        open={openConfirm}
        confirmMessage={`Are you sure you want to create a new label called "${selectedLabel}"?`}
        popupMessageSuccess="Label successfully created"
        popupMessageFailure="Could not create label, try again later"
        onClose={handleConfirmClose}
        onComplete={trigger}
        closePopup={setCloseConfirm}
      />
    </Paper>
  )
}
