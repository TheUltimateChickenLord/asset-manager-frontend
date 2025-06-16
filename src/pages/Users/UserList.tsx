import { useState, useEffect, useMemo } from 'react'
import {
  TextField,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material'
import Fuse from 'fuse.js'
import useAsync from '../../hooks/useAsync'
import type { User } from '../../api/interfaces'
import ItemList from '../../components/ItemList'
import { getUsers } from '../../api/users'
import UserRow from '../../components/UserRow'
import { useAuth } from '../../hooks/useAuth'
import { hasRole } from '../../utils/role_utils'
import { useSearchParams } from 'react-router-dom'

const UserList = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [users, error] = useAsync(getUsers, [])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)

  const fuse = useMemo(
    () =>
      new Fuse(users!, {
        keys: ['name', 'email'],
        threshold: 0.3,
      }),
    [users],
  )

  useEffect(() => {
    let results = users!

    if (searchTerm) {
      results = fuse.search(searchTerm).map((res) => res.item)
    }

    setFilteredUsers(results)
  }, [searchTerm, users, fuse])

  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const paginatedUsers = filteredUsers.slice(page * 10, page * 10 + 10)

  return (
    <ItemList
      title="User"
      newButton={hasRole(user!, 'CreateEditUser')}
      filter={
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setSearchParams({
              search: e.target.value,
            })
          }}
        />
      }
      count={filteredUsers.length}
      page={page}
      onPageChange={setPage}
    >
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Disabled?</TableCell>
          <TableCell>Deleted?</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedUsers.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </TableBody>
    </ItemList>
  )
}

export default UserList
