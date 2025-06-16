import { Chip, TableCell, TableRow } from '@mui/material'
import type { Assignment } from '../api/interfaces'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import { getDueDateInfo } from '../utils/date_utils'

const AssignmentRow = memo(({ assignment }: { assignment: Assignment }) => {
  const navigate = useNavigate()
  const { message, days } = getDueDateInfo(assignment.due_date)
  let colour: 'info' | 'success' | 'error' | 'warning' = 'success'
  if (assignment.returned_at == null) {
    if (days <= 0) colour = 'error'
    else if (days <= 7) colour = 'warning'
    else colour = 'info'
  }

  return (
    <TableRow
      hover
      onClick={() => navigate(`/assignments/${assignment.id}`)}
      sx={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <TableCell>{assignment.asset.asset_tag}</TableCell>
      <TableCell>{assignment.asset.name}</TableCell>
      <TableCell>{assignment.user.email}</TableCell>
      <TableCell>{assignment.assigned_by.email}</TableCell>
      <TableCell>
        {new Date(assignment.assigned_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Chip label={message} color={colour} />
      </TableCell>
      <TableCell>
        {assignment.returned_at &&
          new Date(assignment.returned_at).toLocaleDateString()}
      </TableCell>
    </TableRow>
  )
})

export default AssignmentRow
