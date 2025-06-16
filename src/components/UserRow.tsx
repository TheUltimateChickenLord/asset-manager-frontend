import { Chip, TableCell, TableRow } from '@mui/material'
import type { User } from '../api/interfaces'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'

const UserRow = memo(({ user }: { user: User }) => {
  const navigate = useNavigate()
  return (
    <TableRow
      hover
      onClick={() => navigate(`/users/${user.id}`)}
      sx={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Chip
          label={user.is_disabled ? 'Yes' : 'No'}
          color={user.is_disabled ? 'error' : 'primary'}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={user.is_deleted ? 'Yes' : 'No'}
          color={user.is_deleted ? 'error' : 'primary'}
        />
      </TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
    </TableRow>
  )
})

export default UserRow
