import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  checkInAsset,
  checkOutAsset,
  checkInAssetByAssignment,
  checkOutAssetByRequest,
  myAssignments,
  requestReturnAsset,
  getOverdueAssignments,
  getAssignmentById,
} from '../../src/api/assignments'

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

describe('Assignment API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('checkInAsset success', async () => {
    mockSuccess({ id: 1 })
    await expect(checkInAsset(5)).resolves.toEqual({ id: 1 })
  })

  it('checkInAsset failure', async () => {
    mockFailure('Check-in failed')
    await expect(checkInAsset(5)).rejects.toBe('Check-in failed')
  })

  it('checkOutAsset success', async () => {
    const payload = { asset_id: 1 }
    mockSuccess({ id: 2 })
    await expect(checkOutAsset(payload as any)).resolves.toEqual({ id: 2 })
  })

  it('checkOutAsset failure', async () => {
    mockFailure('Check-out failed')
    await expect(checkOutAsset({} as any)).rejects.toBe('Check-out failed')
  })

  it('checkInAssetByAssignment success', async () => {
    mockSuccess({ id: 3 })
    await expect(checkInAssetByAssignment(10)).resolves.toEqual({ id: 3 })
  })

  it('checkInAssetByAssignment failure', async () => {
    mockFailure('Assignment check-in failed')
    await expect(checkInAssetByAssignment(10)).rejects.toBe(
      'Assignment check-in failed',
    )
  })

  it('checkOutAssetByRequest success', async () => {
    mockSuccess({ id: 4 })
    await expect(checkOutAssetByRequest(7, 5)).resolves.toEqual({ id: 4 })
  })

  it('checkOutAssetByRequest failure', async () => {
    mockFailure('Request checkout failed')
    await expect(checkOutAssetByRequest(7, 5)).rejects.toBe(
      'Request checkout failed',
    )
  })

  it('myAssignments success', async () => {
    mockSuccess([{ id: 1 }])
    await expect(myAssignments()).resolves.toEqual([{ id: 1 }])
  })

  it('myAssignments failure', async () => {
    mockFailure('Failed to load assignments')
    await expect(myAssignments()).rejects.toBe(
      'Failed to load assignments',
    )
  })

  it('requestReturnAsset success (default due_in_days)', async () => {
    mockSuccess({ id: 5 })
    await expect(requestReturnAsset(1)).resolves.toEqual({ id: 5 })
  })

  it('requestReturnAsset failure', async () => {
    mockFailure('Return request failed')
    await expect(requestReturnAsset(1)).rejects.toBe(
      'Return request failed',
    )
  })

  it('getOverdueAssignments success (default param)', async () => {
    mockSuccess([{ id: 6 }])
    await expect(getOverdueAssignments()).resolves.toEqual([{ id: 6 }])
  })

  it('getOverdueAssignments failure', async () => {
    mockFailure('Failed overdue')
    await expect(getOverdueAssignments(3)).rejects.toBe('Failed overdue')
  })

  it('getAssignmentById success', async () => {
    mockSuccess({ id: 9 })
    await expect(getAssignmentById(9)).resolves.toEqual({ id: 9 })
  })

  it('getAssignmentById failure', async () => {
    mockFailure('Not found')
    await expect(getAssignmentById(9)).rejects.toBe('Not found')
  })
})