import {
  Box,
  Typography,
  Table,
  TableContainer,
  Paper,
  Button,
  TablePagination,
} from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const ItemList = ({
  children,
  filter,
  title,
  newButton,
  count,
  page,
  onPageChange,
}: {
  children: ReactNode
  filter: ReactNode
  title: string
  newButton: boolean
  count: number
  page: number
  onPageChange: (newPage: number) => void
}) => {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          {title} List
        </Typography>
        {newButton && (
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="new"
          >
            New {title}
          </Button>
        )}
      </Box>
      {filter && (
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          {filter}
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>{children}</Table>
        {count > 10 && (
          <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={(
              _event: React.MouseEvent<HTMLButtonElement> | null,
              newPage: number,
            ) => onPageChange(newPage)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
          />
        )}
      </TableContainer>
    </Box>
  )
}

export default ItemList
