import { useState, useEffect, useMemo } from 'react'
import {
  TextField,
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
import Fuse from 'fuse.js'
import useAsync from '../../hooks/useAsync'
import { getAssets } from '../../api/assets'
import type { Asset } from '../../api/interfaces'
import ItemList from '../../components/ItemList'
import AssetRow from '../../components/AssetRow'
import { hasRole } from '../../utils/role_utils'
import { useAuth } from '../../hooks/useAuth'
import { useSearchParams } from 'react-router-dom'

const AssetList = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const status = searchParams.get('status') || ''
  const [statusFilter, setStatusFilter] = useState(
    ['Available', 'In Use', 'Maintenance', 'Reserved'].includes(status)
      ? status
      : '',
  )
  const [assets, error] = useAsync(getAssets, [])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [page, setPage] = useState(0)

  const fuse = useMemo(
    () =>
      new Fuse(assets!, {
        keys: ['name', 'description', 'asset_tag'],
        threshold: 0.3,
      }),
    [assets],
  )

  useEffect(() => {
    let results = assets!

    if (searchTerm) {
      results = fuse.search(searchTerm).map((res) => res.item)
    }
    if (statusFilter) {
      results = results.filter((asset) => asset.status === statusFilter)
    }

    setFilteredAssets(results)
  }, [searchTerm, statusFilter, assets, fuse, setSearchParams])

  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const paginatedAssets = filteredAssets.slice(page * 10, page * 10 + 10)

  return (
    <ItemList
      title="Asset"
      newButton={hasRole(user!, 'CreateEditAsset')}
      filter={
        <>
          <TextField
            label="Search Assets"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSearchParams({
                search: e.target.value,
                status: statusFilter,
              })
            }}
          />
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setSearchParams({
                  search: searchTerm,
                  status: e.target.value,
                })
              }}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="In Use">In Use</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
            </Select>
          </FormControl>
        </>
      }
      count={filteredAssets.length}
      page={page}
      onPageChange={setPage}
    >
      <TableHead>
        <TableRow>
          <TableCell>Asset Tag</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Purchase Date</TableCell>
          <TableCell>Cost</TableCell>
          <TableCell>Last Maintenance</TableCell>
          <TableCell>Next Maintenance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedAssets.map((asset) => (
          <AssetRow key={asset.id} asset={asset} />
        ))}
      </TableBody>
    </ItemList>
  )
}

export default AssetList
