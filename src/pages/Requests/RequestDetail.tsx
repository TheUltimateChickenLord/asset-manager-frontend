import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  Alert,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import useAsync from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { hasRoleAccess } from '../../utils/role_utils'
import useConfirm from '../../hooks/useConfirm'
import {
  approveRequest,
  getRequestByID,
  rejectRequest,
} from '../../api/requests'
import NotFound from '../Errors/NotFound'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'
import { useCallback } from 'react'

const statusColors: { [key: string]: 'success' | 'primary' | 'error' } = {
  Approved: 'success',
  Rejected: 'error',
  Pending: 'primary',
}

const RequestDetail = () => {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const [request, error, loading, triggerReload] = useAsync(
    useCallback(() => getRequestByID(Number(id!)), [id]),
  )
  const [openConfirmApprove, setOpenConfirmApprove, setCloseConfirmApprove] =
    useConfirm()
  const [openConfirmReject, setOpenConfirmReject, setCloseConfirmReject] =
    useConfirm()

  const handleConfirmCloseApprove = async (confirm: boolean) => {
    if (confirm) {
      try {
        await approveRequest(Number(id)!)
      } catch {
        return false
      }
    }
    return true
  }

  const handleConfirmCloseReject = async (confirm: boolean) => {
    if (confirm) {
      try {
        await rejectRequest(Number(id)!)
      } catch {
        return false
      }
    }
    return true
  }

  if (loading) return <></>
  if (!request) return <NotFound />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Request for {request.asset.name}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Asset Tag:</Typography>
            <Typography
              component={Link}
              to={`/assets/${request.asset.id}`}
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
              color="primary"
            >
              {request.asset.asset_tag}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Request Status:</Typography>
            <Chip label={request.status} color={statusColors[request.status]} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Justification:</Typography>
            <Typography>{request.justification}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Request Date:</Typography>
            <Typography>
              {new Date(request.requested_at).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Requested By:</Typography>
            <Typography>{request.user.email}</Typography>
          </Grid>
          {request.approver != undefined && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">{request.status} By:</Typography>
              <Typography>{request.approver.email}</Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Asset Labels:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {request.asset.labels.map((label) => (
                <Chip key={label.id} label={label.name} color="default" />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
        {hasRoleAccess(user!, 'CheckInOutAsset', request.asset.labels) &&
          request.status == 'Pending' && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={setOpenConfirmApprove}
              >
                Approve Request
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={setOpenConfirmReject}
              >
                Reject Request
              </Button>
            </>
          )}
        {hasRoleAccess(user!, 'CheckInOutAsset', request.asset.labels) &&
          request.status == 'Approved' && (
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={'check-out'}
            >
              Check Out via Request
            </Button>
          )}
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={prevPage || '/requests'}
        >
          Back
        </Button>
      </Box>

      <ConfirmAlert
        action="Approve"
        open={openConfirmApprove}
        confirmMessage="Are you sure you want to approve this request? This action cannot be undone."
        popupMessageSuccess="Request successfully approved"
        popupMessageFailure="Could not approve request, try again later"
        onClose={handleConfirmCloseApprove}
        onComplete={triggerReload}
        closePopup={setCloseConfirmApprove}
      />
      <ConfirmAlert
        action="Reject"
        open={openConfirmReject}
        confirmMessage="Are you sure you want to reject this request? This action cannot be undone."
        popupMessageSuccess="Request successfully rejected"
        popupMessageFailure="Could not reject request, try again later"
        onClose={handleConfirmCloseReject}
        onComplete={triggerReload}
        closePopup={setCloseConfirmReject}
      />
    </Box>
  )
}

export default RequestDetail
