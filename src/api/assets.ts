import { runFetch } from '../utils/fetch_utils'
import type { Asset, CreateAsset, LinkedAsset, UpdateAsset } from './interfaces'

export const getAssets = async (): Promise<Asset[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/`,
    {
      method: 'GET',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const getAssetById = async (id: number): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/${id}/`,
    {
      method: 'GET',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const addAsset = async (asset: CreateAsset): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const updateAsset = async (
  id: number,
  asset: UpdateAsset,
): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/${id}/`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const deleteAsset = async (id: number): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/${id}/`,
    {
      method: 'DELETE',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const linkAssets = async (
  assetA: number,
  assetB: number,
  relationship: string,
): Promise<LinkedAsset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/${assetA}/link/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linked_id: assetB,
        relation: relationship,
      }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const unlinkAssets = async (
  assetA: number,
  assetB: number,
): Promise<Asset> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assets/${assetA}/link/${assetB}/`,
    {
      method: 'DELETE',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}
