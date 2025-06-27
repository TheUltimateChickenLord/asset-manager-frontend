import { runFetch } from '../utils/fetch_utils'
import type { Assignment, CheckOutAsset } from './interfaces'

export const checkInAsset = async (asset_id: number): Promise<Assignment> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assignments/check-in`,
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
  throw json.detail
}

export const checkOutAsset = async (
  data: CheckOutAsset,
): Promise<Assignment> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assignments/check-out`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const checkInAssetByAssignment = async (
  assignment_id: number,
): Promise<Assignment> => {
  const response = await runFetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/assignments/check-in/${assignment_id}`,
    {
      method: 'POST',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const checkOutAssetByRequest = async (
  request_id: number,
  due_in_days: number,
): Promise<Assignment> => {
  const response = await runFetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/assignments/check-in/${request_id}/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ due_in_days }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const myAssignments = async (): Promise<Assignment[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assignments/my/`,
    {
      method: 'GET',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const requestReturnAsset = async (
  asset_assignment_id: number,
  due_in_days: number = 0,
): Promise<Assignment> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assignments/request-return/`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asset_assignment_id, due_in_days }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const getOverdueAssignments = async (
  due_in_days: number = 0,
): Promise<Assignment[]> => {
  const response = await runFetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/assignments/overdue/?due_in_days=${due_in_days}`,
    {
      method: 'GET',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const getAssignmentById = async (id: number): Promise<Assignment> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${id}/`,
    {
      method: 'GET',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}
