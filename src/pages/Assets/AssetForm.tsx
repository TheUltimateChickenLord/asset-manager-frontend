import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Autocomplete,
  Alert,
  Box,
  Paper,
  Container,
} from '@mui/material'
import { DateField } from '@mui/x-date-pickers'
import { addAsset, updateAsset } from '../../api/assets'
import type { Asset, Label } from '../../api/interfaces'
import dayjs from 'dayjs'
import useAsync from '../../hooks/useAsync'
import { getLabels } from '../../api/labels'
import { useAuth } from '../../hooks/useAuth'
import { hasScopeAll } from '../../utils/role_utils'
import { useHistory } from '../../hooks/useHistory'
import useConfirm from '../../hooks/useConfirm'
import ConfirmAlert from '../../components/ConfirmAlert'

const templateAsset: Asset = {
  id: 0,
  asset_tag: '',
  name: '',
  description: '',
  status: 'Available',
  purchase_date: '',
  purchase_cost: 0,
  created_at: '',
  last_maintenance: '',
  maintenance_rate: 0,
  is_deleted: false,
  linked_assets: [],
  linked_to: [],
  labels: [],
}

const toCurrency = (value: number | string): string => {
  let t = 0
  return String(value)
    .replace(/\./g, (match) => (++t > 1 ? '' : match))
    .replace(/[^0-9.]/g, '')
    .replace(/^(\d+\.\d{2})\d+$/g, '$1')
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

const toInt = (value: number | string): string => {
  return String(value)
    .replace(/[^0-9]/g, '')
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

const AssetForm = ({
  isNew,
  defaultAsset,
}: {
  isNew: boolean
  defaultAsset?: Asset
}) => {
  const prevPage = useHistory()
  const { user } = useAuth()
  const [all_labels] = useAsync(getLabels, [])
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()
  const [formValues, setFormValues] = useState<Asset>(
    defaultAsset ?? templateAsset,
  )
  const navigate = useNavigate()
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [isPending, setIsPending] = useState(false)
  const [id, setId] = useState<number | null>(null)

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {}
    if (formValues.labels.length == 0)
      errors.label = 'At least one label must be selected'

    setError(errors)
    if (Object.keys(errors).length > 0) return

    setOpenConfirm()
  }

  const handleConfirmClose = async (confirm: boolean) => {
    if (!confirm) return true
    setIsPending(true)

    try {
      let result: Asset
      if (isNew) {
        result = await addAsset({
          asset_tag: formValues.asset_tag,
          name: formValues.name,
          description: formValues.description,
          purchase_date: formValues.purchase_date,
          purchase_cost: formValues.purchase_cost,
          maintenance_rate: formValues.maintenance_rate,
          labels: formValues.labels,
        })
      } else {
        result = await updateAsset(defaultAsset!.id, {
          asset_tag: formValues.asset_tag,
          name: formValues.name,
          description: formValues.description,
          purchase_date: formValues.purchase_date,
          purchase_cost: formValues.purchase_cost,
          maintenance_rate: formValues.maintenance_rate,
        })
      }
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
    const pointer = event.target.selectionStart
    const element = event.target
    const name = element.name
    let value: string | number = element.value

    if (name == 'purchase_cost') {
      const formatted_value = toCurrency(value)
      const offset =
        (formatted_value.match(/,/g) || []).length -
        (value.match(/,/g) || []).length

      window.requestAnimationFrame(() => {
        element.selectionStart = pointer! + offset
        element.selectionEnd = pointer! + offset
      })

      value = formatted_value
    }
    setFormValues((formValues) => ({ ...formValues, [name]: value }))
  }
  const handleLabelChange = (_: SyntheticEvent, value: Label[]) => {
    setFormValues((formValues) => ({ ...formValues, labels: value }))
  }

  const canEditAll = hasScopeAll(user!, 'CreateEditAsset')
  const userRoles = user?.roles
    .filter((role) => role.role == 'CreateEditAsset')
    .map((role) => all_labels?.find((label) => label.name == role.scope))
    .filter((role) => role != undefined)

  return (
    <Container>
      <Paper sx={{ p: 4, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {isNew ? 'New Asset' : 'Edit Asset'}
        </Typography>
        <form action={handleSubmit}>
          <TextField
            fullWidth
            label="Asset Tag"
            margin="normal"
            name="asset_tag"
            value={formValues.asset_tag}
            onChange={updateForm}
            required
          />
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            name="name"
            value={formValues.name}
            onChange={updateForm}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            margin="normal"
            name="description"
            value={formValues.description}
            onChange={updateForm}
            required
          />
          <DateField
            fullWidth
            label="Purchase Date"
            margin="normal"
            name="purchase_date"
            value={dayjs(formValues.purchase_date)}
            onChange={(value) =>
              setFormValues((formValues) => ({
                ...formValues,
                purchase_date: value?.toString() ?? '',
              }))
            }
            required
          />
          <TextField
            fullWidth
            label="Purchase Cost"
            margin="normal"
            name="purchase_cost"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
              },
            }}
            value={formValues.purchase_cost}
            onChange={updateForm}
            required
          />
          <TextField
            fullWidth
            label="Maintenance Rate"
            margin="normal"
            name="maintenance_rate"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                ),
              },
            }}
            value={toInt(formValues.maintenance_rate)}
            onChange={updateForm}
            required
          />
          {isNew && (
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
          )}
          <Box mt={2} display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isNew ? 'Create' : 'Save'} Asset
            </Button>
            <Button
              variant="outlined"
              color="error"
              component={Link}
              to={prevPage || isNew ? '/assets' : `/assets/${defaultAsset!.id}`}
            >
              Cancel
            </Button>
          </Box>
          {!!error.general && <Alert severity="error">{error.general}</Alert>}
        </form>

        {isNew ? (
          <ConfirmAlert
            action="Create Asset"
            open={openConfirm}
            confirmMessage="Are you sure you want to create an asset with these values?"
            popupMessageSuccess="Asset successfully created"
            popupMessageFailure="Could not create asset, try again later"
            onClose={handleConfirmClose}
            onComplete={() => navigate(`/assets/${id!}`)}
            closePopup={setCloseConfirm}
          />
        ) : (
          <ConfirmAlert
            action="Update Asset"
            open={openConfirm}
            confirmMessage="Are you sure you want to update this asset with these values?"
            popupMessageSuccess="Asset successfully updated"
            popupMessageFailure="Could not update asset, try again later"
            onClose={handleConfirmClose}
            onComplete={() => navigate(`/assets/${id!}`)}
            closePopup={setCloseConfirm}
          />
        )}
      </Paper>
    </Container>
  )
}

export default AssetForm
