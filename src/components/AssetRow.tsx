import { Chip, TableCell, TableRow } from '@mui/material'
import type { Asset } from '../api/interfaces'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import { getDueDateInfo } from '../utils/date_utils'

const statusColors: {
  [key: string]: 'success' | 'primary' | 'warning' | 'secondary'
} = {
  Available: 'success',
  'In Use': 'primary',
  Maintenance: 'warning',
  Reserved: 'secondary',
}

const AssetRow = memo(({ asset }: { asset: Asset }) => {
  const navigate = useNavigate()
  const nextMaintenance = new Date(
    new Date(asset.last_maintenance || asset.purchase_date).getTime() +
      asset.maintenance_rate * 86400000,
  )
  const { message, days } = getDueDateInfo(nextMaintenance.toISOString())
  let colour: 'info' | 'success' | 'error' | 'warning' = 'success'
  if (days <= 0) colour = 'error'
  else if (days <= 40) colour = 'warning'
  else colour = 'info'

  return (
    <TableRow
      hover
      onClick={() => navigate(`/assets/${asset.id}`)}
      sx={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <TableCell>{asset.asset_tag}</TableCell>
      <TableCell>{asset.name}</TableCell>
      <TableCell>
        <Chip label={asset.status} color={statusColors[asset.status]} />
      </TableCell>
      <TableCell>
        {new Date(asset.purchase_date).toLocaleDateString()}
      </TableCell>
      <TableCell>£{asset.purchase_cost.toFixed(2)}</TableCell>
      <TableCell>
        {asset.last_maintenance &&
          new Date(asset.last_maintenance).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Chip label={message} color={colour} />
      </TableCell>
    </TableRow>
  )
})

export default AssetRow
