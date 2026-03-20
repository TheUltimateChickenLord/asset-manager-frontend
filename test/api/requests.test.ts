import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  getMyRequests,
  getRequests,
  getAllRequests,
  submitRequest,
  approveRequest,
  rejectRequest,
  getRequestByID,
} from '../../src/api/requests'

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

describe('Request API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getMyRequests success', async () => {
    mockSuccess([{ id: 1 }])
    await expect(getMyRequests()).resolves.toEqual([{ id: 1 }])
  })

  it('getMyRequests failure', async () => {
    mockFailure('Failed my requests')
    await expect(getMyRequests()).rejects.toBe('Failed my requests')
  })

  it('getRequests success', async () => {
    mockSuccess([{ id: 2 }])
    await expect(getRequests()).resolves.toEqual([{ id: 2 }])
  })

  it('getRequests failure', async () => {
    mockFailure('Failed all requests')
    await expect(getRequests()).rejects.toBe('Failed all requests')
  })

  it('getAllRequests with pending = false', async () => {
    mockSuccess([{ id: 1 }])
    await expect(getAllRequests(false)).resolves.toEqual([{ id: 1 }])
  })

  it('getAllRequests with pending = true', async () => {
    mockedRunFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([{ id: 1 }]),
    } as any)
    mockedRunFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([{ id: 2 }]),
    } as any)

    await expect(getAllRequests(true)).resolves.toEqual([{ id: 1 }, { id: 2 }])
  })

  it('submitRequest success', async () => {
    mockSuccess({ id: 3 })
    await expect(submitRequest(5, 'Justification')).resolves.toEqual({ id: 3 })
  })

  it('submitRequest failure', async () => {
    mockFailure('Submit failed')
    await expect(submitRequest(5, 'Bad')).rejects.toBe('Submit failed')
  })

  it('approveRequest success', async () => {
    mockSuccess({ id: 4 })
    await expect(approveRequest(4)).resolves.toEqual({ id: 4 })
  })

  it('approveRequest failure', async () => {
    mockFailure('Approve failed')
    await expect(approveRequest(4)).rejects.toBe('Approve failed')
  })

  it('rejectRequest success', async () => {
    mockSuccess({ id: 5 })
    await expect(rejectRequest(5)).resolves.toEqual({ id: 5 })
  })

  it('rejectRequest failure', async () => {
    mockFailure('Reject failed')
    await expect(rejectRequest(5)).rejects.toBe('Reject failed')
  })

  it('getRequestByID success', async () => {
    mockSuccess({ id: 6 })
    await expect(getRequestByID(6)).resolves.toEqual({ id: 6 })
  })

  it('getRequestByID failure', async () => {
    mockFailure('Not found')
    await expect(getRequestByID(6)).rejects.toBe('Not found')
  })
})