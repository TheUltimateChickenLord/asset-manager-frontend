import { useParams } from 'react-router-dom'
import { getAssetById } from '../../api/assets'
import useAsync from '../../hooks/useAsync'
import AssetForm from './AssetForm'
import { useCallback } from 'react'

const EditAssetForm = () => {
  const { id } = useParams()
  const [asset, error, loading] = useAsync(
    useCallback(() => getAssetById(Number(id!)), [id]),
  )
  if (loading) return <></>
  if (error) return <p>{error}</p>
  return <AssetForm isNew={false} defaultAsset={asset!} />
}

export default EditAssetForm
