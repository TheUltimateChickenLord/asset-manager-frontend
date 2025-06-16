import { runFetch } from '../utils/fetch_utils'
import type { User } from './interfaces'

export const loginUser = async (
  username: string,
  password: string,
): Promise<User | null> => {
  try {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await runFetch(
      `${import.meta.env.VITE_BACKEND_URL}/token/`,
      {
        body: formData,
        method: 'POST',
      },
    )

    if (response.ok) {
      localStorage.setItem('jwt', (await response.json()).access_token)
      const user = await runFetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me/`,
        {
          method: 'GET',
        },
      )
      const jsonUser = await user.json()
      localStorage.setItem('user', JSON.stringify(jsonUser))
      return jsonUser
    }
    return null
  } catch {
    return null
  }
}

export const logoutUser = async () => {}
