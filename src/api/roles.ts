import { runFetch } from '../utils/fetch_utils'
import type { Role } from './interfaces'

export const getRoles = async (): Promise<string[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/roles/`,
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

export const assignRole = async (
  user_id: number,
  role: string,
  scope: string,
): Promise<Role> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/roles/user/${user_id}/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role, scope }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.details
}

export const removeRole = async (
  user_id: number,
  role: string,
  scope: string,
): Promise<Role> => {
  const search = new URLSearchParams({ role, scope }).toString()
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/roles/user/${user_id}/?${search}`,
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
