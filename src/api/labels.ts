import { runFetch } from '../utils/fetch_utils'
import type { Label } from './interfaces'

export const getLabels = async (): Promise<Label[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/labels/`,
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

export const createLabel = async (name: string): Promise<Label[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/labels/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const assignLabelUser = async (
  userId: number,
  labelId: number,
): Promise<{
  item_id: number
  label_id: number
}> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/labels/assign/user/${userId}/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ label_id: labelId }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const deleteLabelUser = async (
  userId: number,
  labelId: number,
): Promise<{
  item_id: number
  label_id: number
}> => {
  const response = await runFetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/labels/assign/user/${userId}/?label_id=${labelId}`,
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

export const assignLabelAsset = async (
  assetId: number,
  labelId: number,
): Promise<{
  item_id: number
  label_id: number
}> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/labels/assign/asset/${assetId}/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ label_id: labelId }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const deleteLabelAsset = async (
  assetId: number,
  labelId: number,
): Promise<{
  item_id: number
  label_id: number
}> => {
  const response = await runFetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/labels/assign/asset/${assetId}/?label_id=${labelId}`,
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
