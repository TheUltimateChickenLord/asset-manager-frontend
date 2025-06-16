import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Alert,
} from '@mui/material'
import { getAssets, linkAssets } from '../../api/assets'
import useAsync from '../../hooks/useAsync'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NotFound from '../Errors/NotFound'
import useConfirm from '../../hooks/useConfirm'
import ConfirmAlert from '../../components/ConfirmAlert'
import { hasRoleAccess } from '../../utils/role_utils'
import { useAuth } from '../../hooks/useAuth'
import Unauthorized from '../Errors/Unauthorized'

const relationshipTypes = ['License', 'Consumable', 'Peripheral']

export default function LinkAssetsPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [assets, error, loadingAssets] = useAsync(getAssets)
  const [assetB, setAssetB] = useState(-1)
  const [relationship, setRelationship] = useState('')
  const [openConfirm, setOpenConfirm, setCloseConfirm] = useConfirm()

  if (loadingAssets) return <></>
  const assetA = assets!.find((asset) => asset.id == Number(id!))
  if (assetA == undefined) return <NotFound />
  if (!hasRoleAccess(user!, 'LinkAsset', assetA.labels)) return <Unauthorized />
  if (error)
    return (
      <Alert severity="error">There was an error loading your content</Alert>
    )

  const handleLinkAssets = async (confirm: boolean) => {
    if (assetB != -1 || !relationship || !confirm) return true

    try {
      await linkAssets(assetA.id, assetB, relationship)
      return true
    } catch (e) {
      return false
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Link Asset to {assetA.name} ({assetA.asset_tag})
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <FormControl fullWidth>
          <InputLabel>Child Asset</InputLabel>
          <Select
            value={assetB == -1 ? '' : assetB}
            onChange={(e) => setAssetB(Number(e.target.value))}
            label="Child Asset"
          >
            {assets!
              .filter(
                (asset) =>
                  asset.id != assetA.id &&
                  hasRoleAccess(user!, 'LinkAsset', asset.labels),
              )
              .map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name} ({a.asset_tag})
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Child Relationship Type</InputLabel>
          <Select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            label="Child Relationship Type"
          >
            {relationshipTypes.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={setOpenConfirm}
            disabled={!assetA || !assetB || !relationship}
          >
            Link Assets
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={`/assets/${id!}`}
          >
            Back
          </Button>
        </Box>
      </Box>

      <ConfirmAlert
        action="Link Assets"
        open={openConfirm}
        confirmMessage="Are you sure you want to link these assets?"
        popupMessageSuccess="Assets successfully linked"
        popupMessageFailure="Could not link assets, try again later"
        onClose={handleLinkAssets}
        onComplete={() => navigate(`/assets/${id!}`)}
        closePopup={setCloseConfirm}
      />
    </Paper>
  )
}
