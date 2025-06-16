import { Chip, TableCell, TableRow } from '@mui/material'
import type { Request } from '../api/interfaces'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'

const statusColors: { [key: string]: 'success' | 'primary' | 'error' } = {
  Approved: 'success',
  Rejected: 'error',
  Pending: 'primary',
}

const RequestRow = memo(({ request }: { request: Request }) => {
  const navigate = useNavigate()
  return (
    <TableRow
      hover
      onClick={() => navigate(`/requests/${request.id}`)}
      sx={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <TableCell>{request.asset.asset_tag}</TableCell>
      <TableCell>{request.asset.name}</TableCell>
      <TableCell>
        <Chip label={request.status} color={statusColors[request.status]} />
      </TableCell>
      <TableCell>
        {new Date(request.requested_at).toLocaleDateString()}
      </TableCell>
      <TableCell>{request.user.email}</TableCell>
    </TableRow>
  )
})

export default RequestRow
