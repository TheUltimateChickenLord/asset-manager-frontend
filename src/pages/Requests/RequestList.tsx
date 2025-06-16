import { useState, useEffect, useCallback } from 'react'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material'
import useAsync from '../../hooks/useAsync'
import type { Request } from '../../api/interfaces'
import ItemList from '../../components/ItemList'
import { getAllRequests } from '../../api/requests'
import RequestRow from '../../components/RequestRow'
import { useAuth } from '../../hooks/useAuth'
import { hasRole } from '../../utils/role_utils'
import { useSearchParams } from 'react-router-dom'

const RequestList = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const [statusFilter, setStatusFilter] = useState(
    ['Pending', 'Approved', 'Rejected'].includes(status) ? status : '',
  )
  const requestType = searchParams.get('request_type') || 'Pending Requests'
  const [requestTypeFilter, setRequestTypeFilter] = useState(
    ['My Requests', 'Pending Requests'].includes(requestType)
      ? requestType
      : '',
  )
  const hasPendingRequests = hasRole(user!, 'CheckInOutAsset')
  const [requests, error] = useAsync(
    useCallback(
      () => getAllRequests(hasRole(user!, 'CheckInOutAsset')),
      [user],
    ),
    [],
  )
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    let results = requests!

    if (statusFilter) {
      results = results.filter((request) => request.status === statusFilter)
    }
    if (requestTypeFilter && hasPendingRequests) {
      if (requestTypeFilter == 'My Requests')
        results = results.filter((request) => request.user_id == user!.id)
      else results = results.filter((request) => request.user_id != user!.id)
    }

    setFilteredRequests(results)
  }, [statusFilter, requests, requestTypeFilter, hasPendingRequests, user])

  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const paginatedRequests = filteredRequests.slice(page * 10, page * 10 + 10)

  return (
    <ItemList
      title={hasRole(user!, 'CheckInOutAsset') ? 'Requests' : 'My Requests'}
      newButton={false}
      filter={
        <>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setSearchParams({
                  status: e.target.value,
                  request_type: requestTypeFilter,
                })
              }}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          {hasPendingRequests && (
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Request Type</InputLabel>
              <Select
                value={requestTypeFilter}
                onChange={(e) => {
                  setRequestTypeFilter(e.target.value)
                  setSearchParams({
                    status: statusFilter,
                    request_type: e.target.value,
                  })
                }}
                label="Request Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="My Requests">My Requests</MenuItem>
                <MenuItem value="Pending Requests">Pending Requests</MenuItem>
              </Select>
            </FormControl>
          )}
        </>
      }
      count={filteredRequests.length}
      page={page}
      onPageChange={setPage}
    >
      <TableHead>
        <TableRow>
          <TableCell>Requested Asset Tag</TableCell>
          <TableCell>Requested Asset Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Requested At</TableCell>
          <TableCell>Requested By</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedRequests.map((request) => (
          <RequestRow key={request.id} request={request} />
        ))}
      </TableBody>
    </ItemList>
  )
}

export default RequestList
