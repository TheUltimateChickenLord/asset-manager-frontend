import { useState, useEffect } from 'react'
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
import type { Assignment } from '../../api/interfaces'
import ItemList from '../../components/ItemList'
import { useSearchParams } from 'react-router-dom'
import { myAssignments } from '../../api/assignments'
import AssignmentRow from '../../components/AssignmentRow'
import { useAuth } from '../../hooks/useAuth'

const AssignmentList = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const [statusFilter, setStatusFilter] = useState(
    ['Checked Out', 'Returned'].includes(status) ? status : '',
  )
  const relationship = searchParams.get('relationship') || ''
  const [relationshipFilter, setRelationshipFilter] = useState(
    ['Assigner', 'Requester'].includes(relationship) ? relationship : '',
  )
  const [assignments, error] = useAsync(myAssignments, [])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    [],
  )
  const [page, setPage] = useState(0)

  useEffect(() => {
    let results = assignments!

    if (statusFilter) {
      if (statusFilter == 'Checked Out')
        results = results.filter((assignment) => assignment.returned_at == null)
      else
        results = results.filter((assignment) => assignment.returned_at != null)
    }
    if (relationship) {
      if (relationship == 'Assigner')
        results = results.filter(
          (assignment) => assignment.assigned_by_id == user!.id,
        )
      else
        results = results.filter((assignment) => assignment.user_id == user!.id)
    }

    results = results.sort(
      (a, b) => new Date(a.due_date).valueOf() - new Date(b.due_date).valueOf(),
    )
    results = results
      .filter(
        (assignment) =>
          !(
            assignment.returned_at != null &&
            new Date(assignment.due_date).valueOf() < new Date().valueOf()
          ),
      )
      .concat(
        results.filter(
          (assignment) =>
            assignment.returned_at != null &&
            new Date(assignment.due_date).valueOf() < new Date().valueOf(),
        ),
      )

    setFilteredAssignments(results)
  }, [user, statusFilter, relationship, assignments])

  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const paginatedRequests = filteredAssignments.slice(page * 10, page * 10 + 10)

  return (
    <ItemList
      title={'Assignments'}
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
                  relationship: relationshipFilter,
                })
              }}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Checked Out">Checked Out</MenuItem>
              <MenuItem value="Returned">Returned</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Relationship</InputLabel>
            <Select
              value={relationshipFilter}
              onChange={(e) => {
                setRelationshipFilter(e.target.value)
                setSearchParams({
                  status: statusFilter,
                  relationship: e.target.value,
                })
              }}
              label="Relationship"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Assigner">Assigned By Me</MenuItem>
              <MenuItem value="Requester">Assigned To Me</MenuItem>
            </Select>
          </FormControl>
        </>
      }
      count={filteredAssignments.length}
      page={page}
      onPageChange={setPage}
    >
      <TableHead>
        <TableRow>
          <TableCell>Asset Tag</TableCell>
          <TableCell>Asset Name</TableCell>
          <TableCell>Assigned To</TableCell>
          <TableCell>Assigned By</TableCell>
          <TableCell>Assigned At</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Returned At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedRequests.map((assignment) => (
          <AssignmentRow key={assignment.id} assignment={assignment} />
        ))}
      </TableBody>
    </ItemList>
  )
}

export default AssignmentList
