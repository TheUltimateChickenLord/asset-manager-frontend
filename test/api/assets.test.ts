import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  getAssets,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
  linkAssets,
  unlinkAssets,
} from '../../src/api/assets'

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

describe('Asset API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAssets success', async () => {
    mockSuccess([{ id: 1 }])
    await expect(getAssets()).resolves.toEqual([{ id: 1 }])
  })

  it('getAssets failure', async () => {
    mockFailure('Error')
    await expect(getAssets()).rejects.toBe('Error')
  })

  it('getAssetById success', async () => {
    mockSuccess({ id: 1 })
    await expect(getAssetById(1)).resolves.toEqual({ id: 1 })
  })

  it('getAssetById failure', async () => {
    mockFailure('Not found')
    await expect(getAssetById(1)).rejects.toBe('Not found')
  })

  it('addAsset success', async () => {
    mockSuccess({ id: 1 })
    await expect(addAsset({} as any)).resolves.toEqual({ id: 1 })
  })

  it('addAsset failure', async () => {
    mockFailure('Validation error')
    await expect(addAsset({} as any)).rejects.toBe('Validation error')
  })

  it('updateAsset success', async () => {
    mockSuccess({ id: 1 })
    await expect(updateAsset(1, {} as any)).resolves.toEqual({ id: 1 })
  })

  it('updateAsset failure', async () => {
    mockFailure('Update failed')
    await expect(updateAsset(1, {} as any)).rejects.toBe('Update failed')
  })

  it('deleteAsset success', async () => {
    mockSuccess({ id: 1 })
    await expect(deleteAsset(1)).resolves.toEqual({ id: 1 })
  })

  it('deleteAsset failure', async () => {
    mockFailure('Delete failed')
    await expect(deleteAsset(1)).rejects.toBe('Delete failed')
  })

  it('linkAssets success', async () => {
    mockSuccess({ linked: true })
    await expect(linkAssets(1, 2, 'parent')).resolves.toEqual({ linked: true })
  })

  it('linkAssets failure', async () => {
    mockFailure('Link failed')
    await expect(linkAssets(1, 2, 'parent')).rejects.toBe('Link failed')
  })

  it('unlinkAssets success', async () => {
    mockSuccess({ id: 1 })
    await expect(unlinkAssets(1, 2)).resolves.toEqual({ id: 1 })
  })

  it('unlinkAssets failure', async () => {
    mockFailure('Unlink failed')
    await expect(unlinkAssets(1, 2)).rejects.toBe('Unlink failed')
  })
})