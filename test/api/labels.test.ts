import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fetchUtils from '../../src/utils/fetch_utils'
import {
  getLabels,
  createLabel,
  assignLabelUser,
  deleteLabelUser,
  assignLabelAsset,
  deleteLabelAsset,
} from '../../src/api/labels'

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

describe('Label API service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getLabels success', async () => {
    mockSuccess([{ id: 1, name: 'Test' }])
    await expect(getLabels()).resolves.toEqual([{ id: 1, name: 'Test' }])
  })

  it('getLabels failure', async () => {
    mockFailure('Failed to fetch labels')
    await expect(getLabels()).rejects.toBe('Failed to fetch labels')
  })

  it('createLabel success', async () => {
    mockSuccess([{ id: 2, name: 'New' }])
    await expect(createLabel('New')).resolves.toEqual([
      { id: 2, name: 'New' },
    ])
  })

  it('createLabel failure', async () => {
    mockFailure('Create failed')
    await expect(createLabel('Bad')).rejects.toBe('Create failed')
  })

  it('assignLabelUser success', async () => {
    mockSuccess({ item_id: 1, label_id: 2 })
    await expect(assignLabelUser(1, 2)).resolves.toEqual({
      item_id: 1,
      label_id: 2,
    })
  })

  it('assignLabelUser failure', async () => {
    mockFailure('Assign user failed')
    await expect(assignLabelUser(1, 2)).rejects.toBe(
      'Assign user failed',
    )
  })

  it('deleteLabelUser success', async () => {
    mockSuccess({ item_id: 1, label_id: 2 })
    await expect(deleteLabelUser(1, 2)).resolves.toEqual({
      item_id: 1,
      label_id: 2,
    })
  })

  it('deleteLabelUser failure', async () => {
    mockFailure('Delete user label failed')
    await expect(deleteLabelUser(1, 2)).rejects.toBe(
      'Delete user label failed',
    )
  })

  it('assignLabelAsset success', async () => {
    mockSuccess({ item_id: 10, label_id: 5 })
    await expect(assignLabelAsset(10, 5)).resolves.toEqual({
      item_id: 10,
      label_id: 5,
    })
  })

  it('assignLabelAsset failure', async () => {
    mockFailure('Assign asset failed')
    await expect(assignLabelAsset(10, 5)).rejects.toBe(
      'Assign asset failed',
    )
  })

  it('deleteLabelAsset success', async () => {
    mockSuccess({ item_id: 10, label_id: 5 })
    await expect(deleteLabelAsset(10, 5)).resolves.toEqual({
      item_id: 10,
      label_id: 5,
    })
  })

  it('deleteLabelAsset failure', async () => {
    mockFailure('Delete asset label failed')
    await expect(deleteLabelAsset(10, 5)).rejects.toBe(
      'Delete asset label failed',
    )
  })
})