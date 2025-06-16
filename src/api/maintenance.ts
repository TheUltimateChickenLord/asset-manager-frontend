import { runFetch } from '../utils/fetch_utils'
import type { Asset } from './interfaces'

export const checkInAssetMaintenance = async (
  asset_id: number,
): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/maintenance/check-in/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asset_id }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const checkOutAssetMaintenance = async (
  asset_id: number,
): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/maintenance/check-out/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asset_id }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}
