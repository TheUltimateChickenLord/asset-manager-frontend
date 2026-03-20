import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  getRoles,
  assignRole,
  removeRole,
} from '../../src/api/roles'

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

describe('Roles API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getRoles success', async () => {
    mockSuccess(['admin', 'user'])
    await expect(getRoles()).resolves.toEqual(['admin', 'user'])
  })

  it('getRoles failure', async () => {
    mockFailure('Failed to fetch roles')
    await expect(getRoles()).rejects.toBe('Failed to fetch roles')
  })

  it('assignRole success', async () => {
    mockSuccess({ user_id: 1, role: 'admin', scope: 'global' })
    await expect(assignRole(1, 'admin', 'global')).resolves.toEqual({
      user_id: 1,
      role: 'admin',
      scope: 'global',
    })
  })

  it('assignRole failure', async () => {
    mockFailure('Assign role failed')
    await expect(assignRole(1, 'admin', 'global')).rejects.toBe(
      'Assign role failed',
    )
  })

  it('removeRole success', async () => {
    mockSuccess({ user_id: 1, role: 'admin', scope: 'global' })
    await expect(removeRole(1, 'admin', 'global')).resolves.toEqual({
      user_id: 1,
      role: 'admin',
      scope: 'global',
    })
  })

  it('removeRole failure', async () => {
    mockFailure('Remove role failed')
    await expect(removeRole(1, 'admin', 'global')).rejects.toBe(
      'Remove role failed',
    )
  })
})