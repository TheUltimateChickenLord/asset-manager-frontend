import { Container, Typography, Grid, Paper, Alert } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import type { User } from '../api/interfaces'
import { getAssets } from '../api/assets'
import { myAssignments } from '../api/assignments'
import { getMyRequests, getRequests } from '../api/requests'
import useAsync from '../hooks/useAsync'
import { hasRole } from '../utils/role_utils'
import { getUsers } from '../api/users'
import { addDays } from '../utils/date_utils'
import { Link } from 'react-router-dom'
import { useCallback } from 'react'

interface Dashboard {
  name: string
  value: number
  link: string
}

async function getDashboards(user: User) {
  const results: Promise<Dashboard | Dashboard[]>[] = []
  if (hasRole(user, 'ReadUser')) {
    results.push(
      getUsers().then((value) => ({
        name: 'Total Users',
        value: value.length,
        link: '/users',
      })),
    )
  }
  if (hasRole(user, 'RequestAsset')) {
    results.push(
      getMyRequests().then((value) => [
        {
          name: 'Your Pending Requests',
          value: value.filter((request) => request.status == 'Pending').length,
          link: '/requests?status=Pending&request_type=My+Requests',
        },
        {
          name: 'New Requests (last 7 days)',
          value: value.filter(
            (request) =>
              new Date(request.requested_at) > addDays(new Date(), -7),
          ).length,
          link: '/requests?status=&request_type=My+Requests',
        },
      ]),
    )
  }
  if (hasRole(user, 'CheckInOutAsset')) {
    results.push(
      getRequests().then((value) => ({
        name: 'Requests You Oversee',
        value: value.filter(
          (request) =>
            request.status == 'Pending' && request.user_id != user.id,
        ).length,
        link: '/requests?status=Pending&request_type=Requests+I+Oversee',
      })),
    )
  }
  results.push(
    myAssignments().then((value) => [
      {
        name: 'Assigned To You',
        value: value.filter((assignment) => assignment.user_id == user.id)
          .length,
        link: '/assignments?status=&relationship=Requester',
      },
      {
        name: 'Overdue Assignments',
        value: value.filter(
          (assignment) =>
            new Date(assignment.due_date) < new Date() &&
            assignment.user_id == user.id,
        ).length,
        link: '/assignments?status=&relationship=Requester',
      },
      {
        name: 'Assignments Due Soon (7 days)',
        value: value.filter(
          (assignment) =>
            new Date(assignment.due_date) < addDays(new Date(), 7) &&
            new Date(assignment.due_date) > new Date() &&
            assignment.user_id == user.id,
        ).length,
        link: '/assignments?status=&relationship=Requester',
      },
    ]),
  )
  if (hasRole(user, 'RequestAsset')) {
    results.push(
      getAssets().then((value) => ({
        name: 'Available Assets',
        value: value.filter((asset) => asset.status == 'Available').length,
        link: '/assets?search=&status=Available',
      })),
    )
  }
  if (hasRole(user, 'CheckInOutAsset')) {
    results.push(
      getAssets().then((value) => ({
        name: 'In Use Assets',
        value: value.filter((asset) => asset.status == 'In Use').length,
        link: '/assets?search=&status=In+Use',
      })),
    )
  }

  return (await Promise.all(results)).flat(1)
}

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboards, error, loading] = useAsync(
    useCallback(() => getDashboards(user!), [user]),
  )

  if (loading || !dashboards) return <></>
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {dashboards
          .filter((dashboard) => dashboard.value != 0)
          .map((dashboard) => (
            <Grid
              key={dashboard.name}
              size={{ xs: 12, md: 6 }}
              component={Link}
              to={dashboard.link}
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">{dashboard.name}</Typography>
                <Typography variant="h4">{dashboard.value}</Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}

export default Dashboard
