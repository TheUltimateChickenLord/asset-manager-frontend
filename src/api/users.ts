import { runFetch } from '../utils/fetch_utils'
import type { CreateUser, User } from './interfaces'

export const getCurrentUser = async (): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/me/`,
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

export const getUsers = async (): Promise<User[]> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/`,
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

export const getUserById = async (id: number): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/`,
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

export const createUser = async (data: CreateUser): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/`,
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

export const deleteUser = async (id: number): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/`,
    {
      method: 'DELETE',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const disableUser = async (id: number): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/?temp=true`,
    {
      method: 'DELETE',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const enableUser = async (id: number): Promise<User> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/`,
    {
      method: 'PUT',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const resetPasswordUser = async (id: number): Promise<string> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}/reset-password/`,
    {
      method: 'PUT',
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}

export const resetPasswordSelf = async (password: string): Promise<string> => {
  const response = await runFetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password/`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    },
  )
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw json.detail
}
