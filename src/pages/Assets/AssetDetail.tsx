import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  Alert,
} from '@mui/material'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import useAsync from '../../hooks/useAsync'
import { deleteAsset, getAssetById, getAssets } from '../../api/assets'
import { useAuth } from '../../hooks/useAuth'
import { hasRole, hasRoleAccess } from '../../utils/role_utils'
import useConfirm from '../../hooks/useConfirm'
import { checkInAsset, myAssignments } from '../../api/assignments'
import NotFound from '../Errors/NotFound'
import { getAllRequests } from '../../api/requests'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'
import { getDueDateInfo } from '../../utils/date_utils'
import {
  checkInAssetMaintenance,
  checkOutAssetMaintenance,
} from '../../api/maintenance'
import { useCallback } from 'react'
import LinkedRow from '../../components/LinkedRow'

const statusColors: {
  [key: string]: 'success' | 'primary' | 'warning' | 'secondary'
} = {
  Available: 'success',
  'In Use': 'primary',
  Maintenance: 'warning',
  Reserved: 'secondary',
}

const AssetDetail = () => {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [asset, error, loading, triggerReload] = useAsync(
    useCallback(() => getAssetById(Number(id!)), [id]),
  )
  const [requests, error_requests, loading_requests] = useAsync(
    useCallback(
      () => getAllRequests(hasRole(user!, 'CheckInOutAsset')),
      [user],
    ),
  )
  const [assets] = useAsync(getAssets, [])
  const [assignments, error_assignments, loading_assignments] =
    useAsync(myAssignments)
  const [openConfirmRetire, setOpenConfirmRetire, setCloseConfirmRetire] =
    useConfirm()
  const [openConfirmCheckIn, setOpenConfirmCheckIn, setCloseConfirmCheckIn] =
    useConfirm()
  const [
    openConfirmCheckInMain,
    setOpenConfirmCheckInMain,
    setCloseConfirmCheckInMain,
  ] = useConfirm()
  const [
    openConfirmCheckOutMain,
    setOpenConfirmCheckOutMain,
    setCloseConfirmCheckOutMain,
  ] = useConfirm()

  const handleConfirmRetire = async (confirm: boolean) => {
    if (confirm) {
      try {
        await deleteAsset(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }

  const handleConfirmCheckIn = async (confirm: boolean) => {
    if (confirm) {
      try {
        await checkInAsset(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }

  const handleConfirmCheckInMain = async (confirm: boolean) => {
    if (confirm) {
      try {
        await checkInAssetMaintenance(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }

  const handleConfirmCheckOutMain = async (confirm: boolean) => {
    if (confirm) {
      try {
        await checkOutAssetMaintenance(Number(id!))
      } catch {
        return false
      }
    }
    return true
  }

  if (loading) return <></>
  if (!asset) return <NotFound />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )
  if (asset.is_deleted) return <Navigate to="/assets" />

  const nextMaintenance = new Date(
    new Date(asset.last_maintenance || asset.purchase_date).getTime() +
      asset.maintenance_rate * 86400000,
  )
  const { message, days } = getDueDateInfo(nextMaintenance.toISOString())
  let colour: 'info' | 'success' | 'error' | 'warning' = 'success'
  if (days <= 0) colour = 'error'
  else if (days <= 40) colour = 'warning'
  else colour = 'info'

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {asset.name}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Asset Tag:</Typography>
            <Typography>{asset.asset_tag}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Status:</Typography>
            <Chip label={asset.status} color={statusColors[asset.status]} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Description:</Typography>
            <Typography>{asset.description}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Purchase Date:</Typography>
            <Typography>
              {new Date(asset.purchase_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Purchase Cost:</Typography>
            <Typography>£{asset.purchase_cost.toFixed(2)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Last Maintenance:</Typography>
            <Typography>
              {asset.last_maintenance &&
                new Date(asset.last_maintenance).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Next Maintenance Due:</Typography>
            <Chip label={message} color={colour} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Labels:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {asset.labels.map((label) => (
                <Chip key={label.id} label={label.name} color="default" />
              ))}
            </Box>
          </Grid>
          <LinkedRow
            asset={asset}
            relation="Peripheral"
            assets={assets!}
            trigger={triggerReload}
          />
          <LinkedRow
            asset={asset}
            relation="Consumable"
            assets={assets!}
            trigger={triggerReload}
          />
          <LinkedRow
            asset={asset}
            relation="License"
            assets={assets!}
            trigger={triggerReload}
          />
        </Grid>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
        {hasRoleAccess(user!, 'CheckInOutAsset', asset.labels) &&
          asset.status == 'In Use' && (
            <Button
              variant="contained"
              color="primary"
              onClick={setOpenConfirmCheckIn}
            >
              Check In
            </Button>
          )}
        {hasRoleAccess(user!, 'CheckInOutAsset', asset.labels) &&
          asset.status == 'Available' && (
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="check-out"
            >
              Check Out
            </Button>
          )}
        {hasRoleAccess(user!, 'CheckInOutAsset', asset.labels) &&
          asset.status == 'Maintenance' && (
            <Button
              variant="contained"
              color="primary"
              onClick={setOpenConfirmCheckInMain}
            >
              Check In From Maintenance
            </Button>
          )}
        {hasRoleAccess(user!, 'CheckInOutAsset', asset.labels) &&
          asset.status == 'Available' && (
            <Button
              variant="contained"
              color="primary"
              onClick={setOpenConfirmCheckOutMain}
            >
              Check Out For Maintenance
            </Button>
          )}
        {hasRoleAccess(user!, 'CreateEditAsset', asset.labels) && (
          <Button variant="outlined" color="info" component={Link} to="edit">
            Edit
          </Button>
        )}
        {hasRoleAccess(user!, 'RetireAsset', asset.labels) && (
          <Button
            variant="contained"
            color="error"
            onClick={setOpenConfirmRetire}
          >
            Retire Asset
          </Button>
        )}
        {hasRoleAccess(user!, 'RequestAsset', asset.labels) &&
          !hasRoleAccess(user!, 'CheckInOutAsset', asset.labels) &&
          asset.status == 'Available' &&
          !loading_requests &&
          !error_requests &&
          requests &&
          requests.find(
            (request) =>
              request.asset_id == asset.id &&
              request.user_id == user!.id &&
              ['Pending', 'Approved'].includes(request.status),
          ) == undefined && (
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to="request"
            >
              Request Asset
            </Button>
          )}
        {hasRoleAccess(user!, 'RequestAsset', asset.labels) &&
          asset.status == 'Reserved' &&
          !loading_requests &&
          !error_requests &&
          requests &&
          requests.find(
            (request) =>
              request.asset_id == asset.id &&
              ['Pending', 'Approved'].includes(request.status),
          ) != undefined && (
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to={`/requests/${
                requests.find(
                  (request) =>
                    request.asset_id == asset.id &&
                    ['Pending', 'Approved'].includes(request.status),
                )!.id
              }`}
            >
              View Request
            </Button>
          )}
        {asset.status == 'In Use' &&
          !loading_assignments &&
          !error_assignments &&
          assignments &&
          assignments.find(
            (assignment) =>
              assignment.asset_id == asset.id && assignment.returned_at == null,
          ) != undefined && (
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to={`/assignments/${
                assignments.find(
                  (assignment) =>
                    assignment.asset_id == asset.id &&
                    assignment.returned_at == null,
                )!.id
              }`}
            >
              View Assignment
            </Button>
          )}
        {hasRoleAccess(user!, 'CreateEditAsset', asset.labels) && (
          <Button variant="outlined" color="info" component={Link} to="labels">
            Add Labels
          </Button>
        )}
        {hasRoleAccess(user!, 'LinkAsset', asset.labels) && (
          <Button variant="outlined" color="info" component={Link} to="link">
            Link Asset
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={prevPage || '/assets'}
        >
          Back
        </Button>
      </Box>

      <ConfirmAlert
        action="Retire"
        open={openConfirmRetire}
        confirmMessage="Are you sure you want to retire this asset? This action cannot be undone."
        popupMessageSuccess="Asset successfully retired"
        popupMessageFailure="Could not retire asset, try again later"
        onClose={handleConfirmRetire}
        onComplete={() => navigate('/assets')}
        closePopup={setCloseConfirmRetire}
      />
      <ConfirmAlert
        action="Check In"
        open={openConfirmCheckIn}
        confirmMessage="Are you sure you want to check in this asset?"
        popupMessageSuccess="Asset successfully checked in"
        popupMessageFailure="Could not check in asset, try again later"
        onClose={handleConfirmCheckIn}
        onComplete={triggerReload}
        closePopup={setCloseConfirmCheckIn}
      />
      <ConfirmAlert
        action="Check In From Maintenance"
        open={openConfirmCheckInMain}
        confirmMessage="Are you sure you want to check in this asset from maintenance?"
        popupMessageSuccess="Asset successfully checked in from maintenance"
        popupMessageFailure="Could not check in asset from maintenance, try again later"
        onClose={handleConfirmCheckInMain}
        onComplete={triggerReload}
        closePopup={setCloseConfirmCheckInMain}
      />
      <ConfirmAlert
        action="Check Out For Maintenance"
        open={openConfirmCheckOutMain}
        confirmMessage="Are you sure you want to check out this asset for maintenance?"
        popupMessageSuccess="Asset successfully checked out for maintenance"
        popupMessageFailure="Could not check out asset for maintenance, try again later"
        onClose={handleConfirmCheckOutMain}
        onComplete={triggerReload}
        closePopup={setCloseConfirmCheckOutMain}
      />
    </Box>
  )
}

export default AssetDetail
