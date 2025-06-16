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
  checkInAssetByAssignment,
  getAssignmentById,
  requestReturnAsset,
} from '../../api/assignments'
import NotFound from '../Errors/NotFound'
import { addDays, getDueDateInfo } from '../../utils/date_utils'
import ConfirmAlert from '../../components/ConfirmAlert'
import { useHistory } from '../../hooks/useHistory'
import { useCallback } from 'react'

const AssignmentDetail = () => {
  const prevPage = useHistory()
  const { id } = useParams()
  const { user } = useAuth()
  const [assignment, error, loading, triggerReload] = useAsync(
    useCallback(() => getAssignmentById(Number(id!)), [id]),
  )
  const [openConfirmCheckIn, setOpenConfirmCheckIn, setCloseConfirmCheckIn] =
    useConfirm()
  const [openConfirmReturn, setOpenConfirmReturn, setCloseConfirmReturn] =
    useConfirm()

  const handleConfirmCloseCheckIn = async (confirm: boolean) => {
    if (confirm) {
      try {
        await checkInAssetByAssignment(Number(id)!)
      } catch {
        return false
      }
    }
    return true
  }

  const handleConfirmCloseReturn = async (confirm: boolean) => {
    if (confirm) {
      try {
        await requestReturnAsset(Number(id)!)
      } catch {
        return false
      }
    }
    return true
  }

  if (loading) return <></>
  if (!assignment) return <NotFound />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const { message, days } = getDueDateInfo(assignment.due_date)
  let colour: 'info' | 'success' | 'error' | 'warning' = 'success'
  if (assignment.returned_at == null) {
    if (days <= 0) colour = 'error'
    else if (days <= 7) colour = 'warning'
    else colour = 'info'
  }

  const returnedLate =
    assignment.returned_at &&
    addDays(new Date(assignment.due_date), 1) < new Date(assignment.returned_at)

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Assignment of {assignment.asset.name}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Asset Tag:</Typography>
            <Typography
              component={Link}
              to={`/assets/${assignment.asset.id}`}
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
              color="primary"
            >
              {assignment.asset.asset_tag}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Assigned To:</Typography>
            <Typography
              component={Link}
              to={`/users/${assignment.user_id}`}
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
              color="primary"
            >
              {assignment.user.email}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Assigned By:</Typography>
            <Typography
              component={Link}
              to={`/users/${assignment.assigned_by_id}`}
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
              color="primary"
            >
              {assignment.assigned_by.email}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Assigned At:</Typography>
            <Typography>
              {new Date(assignment.assigned_at).toLocaleDateString()}
            </Typography>
          </Grid>
          {assignment.returned_at && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2">Returned at At:</Typography>
                <Typography>
                  {new Date(assignment.returned_at).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2">Returned Status:</Typography>
                <Chip
                  label={returnedLate ? 'Late' : 'On Time'}
                  color={returnedLate ? 'error' : 'success'}
                />
              </Grid>
            </>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Due Date:</Typography>
            <Chip label={message} color={colour} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Asset Labels:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {assignment.asset.labels.map((label) => (
                <Chip key={label.id} label={label.name} color="default" />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
        {hasRoleAccess(user!, 'CheckInOutAsset', assignment.asset.labels) &&
          assignment.returned_at == null && (
            <Button
              variant="contained"
              color="primary"
              onClick={setOpenConfirmCheckIn}
            >
              Check In Asset
            </Button>
          )}
        {hasRoleAccess(user!, 'CheckInOutAsset', assignment.asset.labels) &&
          assignment.returned_at == null &&
          new Date(assignment.due_date).valueOf() - new Date().valueOf() >
            0 && (
            <Button
              variant="contained"
              color="error"
              onClick={setOpenConfirmReturn}
            >
              Request Immediate Return
            </Button>
          )}
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to={prevPage || '/assignments'}
        >
          Back
        </Button>
      </Box>

      <ConfirmAlert
        action="Check In"
        open={openConfirmCheckIn}
        confirmMessage={`Are you sure you want to check in ${assignment.asset.name}?`}
        popupMessageSuccess="Asset successfully checked in"
        popupMessageFailure="Could not check in asset, try again later"
        onClose={handleConfirmCloseCheckIn}
        onComplete={triggerReload}
        closePopup={setCloseConfirmCheckIn}
      />
      <ConfirmAlert
        action="Request Return"
        open={openConfirmReturn}
        confirmMessage={`Are you sure you want to request the immediate return of ${assignment.asset.name}? This will set the due date for this assignment to today.`}
        popupMessageSuccess="Request submitted, the due date for this asset is now today"
        popupMessageFailure="Could not request the return of this asset, try again later"
        onClose={handleConfirmCloseReturn}
        onComplete={triggerReload}
        closePopup={setCloseConfirmReturn}
      />
    </Box>
  )
}

export default AssignmentDetail
