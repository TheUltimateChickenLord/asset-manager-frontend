import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  getCurrentUser,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  disableUser,
  enableUser,
  resetPasswordUser,
  resetPasswordSelf,
} from '../../src/api/users'

vi.mock('../../src/utils/fetch_utils')

const mockedRunFetch = vi.mocked(fetchUtils.runFetch)

const mockSuccess = (data: any) => {
  mockedRunFetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(data),
  } as any)
}

const mockFailure = (message: string) => {
  mockedRunFetch.mockResolvedValue({
    ok: false,
    json: vi.fn().mockResolvedValue({ detail: message }),
  } as any)
}

describe('Users API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getCurrentUser success', async () => {
    mockSuccess({ id: 1, name: 'Alice' })
    await expect(getCurrentUser()).resolves.toEqual({ id: 1, name: 'Alice' })
  })

  it('getCurrentUser failure', async () => {
    mockFailure('Failed current user')
    await expect(getCurrentUser()).rejects.toBe('Failed current user')
  })

  it('getUsers success', async () => {
    mockSuccess([{ id: 1 }])
    await expect(getUsers()).resolves.toEqual([{ id: 1 }])
  })

  it('getUsers failure', async () => {
    mockFailure('Failed users')
    await expect(getUsers()).rejects.toBe('Failed users')
  })

  it('getUserById success', async () => {
    mockSuccess({ id: 2 })
    await expect(getUserById(2)).resolves.toEqual({ id: 2 })
  })

  it('getUserById failure', async () => {
    mockFailure('User not found')
    await expect(getUserById(2)).rejects.toBe('User not found')
  })

  it('createUser success', async () => {
    const data = { name: 'Bob', email: 'bob@test.com' }
    mockSuccess({ id: 3, ...data })
    await expect(createUser(data as any)).resolves.toEqual({ id: 3, ...data })
  })

  it('createUser failure', async () => {
    mockFailure('Create failed')
    await expect(createUser({} as any)).rejects.toBe('Create failed')
  })

  it('deleteUser success', async () => {
    mockSuccess({ id: 4 })
    await expect(deleteUser(4)).resolves.toEqual({ id: 4 })
  })

  it('deleteUser failure', async () => {
    mockFailure('Delete failed')
    await expect(deleteUser(4)).rejects.toBe('Delete failed')
  })

  it('disableUser success', async () => {
    mockSuccess({ id: 5 })
    await expect(disableUser(5)).resolves.toEqual({ id: 5 })
  })

  it('disableUser failure', async () => {
    mockFailure('Disable failed')
    await expect(disableUser(5)).rejects.toBe('Disable failed')
  })

  it('enableUser success', async () => {
    mockSuccess({ id: 6 })
    await expect(enableUser(6)).resolves.toEqual({ id: 6 })
  })

  it('enableUser failure', async () => {
    mockFailure('Enable failed')
    await expect(enableUser(6)).rejects.toBe('Enable failed')
  })

  it('resetPasswordUser success', async () => {
    mockSuccess('Password reset')
    await expect(resetPasswordUser(7)).resolves.toBe('Password reset')
  })

  it('resetPasswordUser failure', async () => {
    mockFailure('Reset failed')
    await expect(resetPasswordUser(7)).rejects.toBe('Reset failed')
  })

  it('resetPasswordSelf success', async () => {
    mockSuccess('Password changed')
    await expect(resetPasswordSelf('newpass')).resolves.toBe('Password changed')
  })

  it('resetPasswordSelf failure', async () => {
    mockFailure('Change failed')
    await expect(resetPasswordSelf('badpass')).rejects.toBe('Change failed')
  })
})