import { runFetch } from '../utils/fetch_utils'
import type { Request } from './interfaces'

export const getAllRequests = async (pending: boolean): Promise<Request[]> => {
  const requests = [getMyRequests()]
  if (pending) requests.push(getRequests())
  return (await Promise.all(requests)).reduce((a, b) => a.concat(b))
}

export const getMyRequests = async (): Promise<Request[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/my/`,
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

export const getRequests = async (): Promise<Request[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/`,
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

export const submitRequest = async (
  id: number,
  justification: string,
): Promise<Request> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ asset_id: id, justification }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const approveRequest = async (id: number): Promise<Request> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/approve/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const rejectRequest = async (id: number): Promise<Request> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/reject/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const getRequestByID = async (id: number): Promise<Request> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/requests/${id}/`,
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
