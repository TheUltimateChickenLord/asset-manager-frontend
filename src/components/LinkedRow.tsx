import { Box, Typography, Chip, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Asset, LinkedAsset } from '../api/interfaces'
import { useAuth } from '../hooks/useAuth'
import useConfirm from '../hooks/useConfirm'
import { unlinkAssets } from '../api/assets'
import { hasRoleAccess } from '../utils/role_utils'
import ConfirmAlert from './ConfirmAlert'

const LinkedRow = ({
  asset,
  relation,
  assets,
  trigger,
}: {
  asset: Asset
  relation: 'License' | 'Consumable' | 'Peripheral'
  assets: Asset[]
  trigger: () => void
}) => {
  const filteredLinks = asset.linked_to.filter(
    (link) => link.relation == relation,
  )

  if (filteredLinks.length == 0) return <></>

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2">{relation}s:</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {filteredLinks.map((linkedAsset) => (
            <AssetChip
              key={linkedAsset.id}
              linkedAsset={linkedAsset}
              assets={assets}
              trigger={trigger}
            />
          ))}
        </Box>
      </Grid>
    </>
  )
}

const AssetChip = ({
  linkedAsset,
  assets,
  trigger,
}: {
  linkedAsset: LinkedAsset
  assets: Asset[]
  trigger: () => void
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [
    openConfirmDeleteLink,
    setOpenConfirmDeleteLink,
    setCloseConfirmDeleteLink,
  ] = useConfirm()

  const handleConfirmDeleteLink = async (confirm: boolean) => {
    if (confirm) {
      try {
        await unlinkAssets(linkedAsset.asset_id, linkedAsset.linked_id)
      } catch {
        return false
      }
    }
    return true
  }

  const thisAssetDetails = assets.find(
    (asset) => asset.id == linkedAsset.asset_id,
  )
  const otherAssetDetails = assets.find(
    (asset) => asset.id == linkedAsset.linked_id,
  )
  const askConfirmDeleteLink =
    thisAssetDetails &&
    hasRoleAccess(user!, 'LinkAsset', thisAssetDetails.labels) &&
    otherAssetDetails &&
    hasRoleAccess(user!, 'LinkAsset', otherAssetDetails.labels)
      ? setOpenConfirmDeleteLink
      : undefined

  return (
    <>
      <Chip
        label={`#${linkedAsset.asset_id}`}
        onClick={() => navigate(`/assets/${linkedAsset.asset_id}`)}
        color="default"
        sx={{ textDecoration: 'none', cursor: 'pointer' }}
        onDelete={askConfirmDeleteLink}
      />

      {askConfirmDeleteLink != undefined && (
        <ConfirmAlert
          action="Unlink Assets"
          open={openConfirmDeleteLink}
          confirmMessage={`Are you sure you want to unlink assets #${linkedAsset.asset_id} and #${linkedAsset.linked_id}? This action cannot be undone.`}
          popupMessageSuccess="Assets successfully unlinked"
          popupMessageFailure="Could not unlink assets, try again later"
          onClose={handleConfirmDeleteLink}
          onComplete={trigger}
          closePopup={setCloseConfirmDeleteLink}
        />
      )}
    </>
  )
}

export default LinkedRow
