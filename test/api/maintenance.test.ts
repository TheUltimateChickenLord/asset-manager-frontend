import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  checkInAssetMaintenance,
  checkOutAssetMaintenance,
} from '../../src/api/maintenance'

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

describe('Maintenance API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('checkInAssetMaintenance success', async () => {
    mockSuccess({ id: 1 })
    await expect(checkInAssetMaintenance(5)).resolves.toEqual({ id: 1 })
  })

  it('checkInAssetMaintenance failure', async () => {
    mockFailure('Maintenance check-in failed')
    await expect(checkInAssetMaintenance(5)).rejects.toBe(
      'Maintenance check-in failed',
    )
  })

  it('checkOutAssetMaintenance success', async () => {
    mockSuccess({ id: 2 })
    await expect(checkOutAssetMaintenance(8)).resolves.toEqual({ id: 2 })
  })

  it('checkOutAssetMaintenance failure', async () => {
    mockFailure('Maintenance check-out failed')
    await expect(checkOutAssetMaintenance(8)).rejects.toBe(
      'Maintenance check-out failed',
    )
  })
})