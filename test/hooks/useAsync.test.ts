import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useAsync from '../../src/hooks/useAsync'

describe('useAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading true and default value', () => {
    const callback = vi.fn(() => Promise.resolve('result'))

    const { result } = renderHook(() => useAsync(callback, 'default'))

    const [value, error, loading] = result.current

    expect(value).toBe('default')
    expect(error).toBeUndefined()
    expect(loading).toBe(true)
  })

  it('should resolve and set value', async () => {
    const callback = vi.fn(() => Promise.resolve('success'))

    const { result } = renderHook(() => useAsync(callback))

    await waitFor(() => {
      expect(result.current[2]).toBe(false) // loading false
    })

    const [value, error, loading] = result.current

    expect(value).toBe('success')
    expect(error).toBeUndefined()
    expect(loading).toBe(false)
  })

  it('should handle errors correctly', async () => {
    const error = new Error('fail')
    const callback = vi.fn(() => Promise.reject(error))

    const { result } = renderHook(() => useAsync(callback))

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    const [value, err, loading] = result.current

    expect(value).toBeUndefined()
    expect(err).toBe(error)
    expect(loading).toBe(false)
  })

  it('should re-run when triggerReload is called', async () => {
    const callback = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second')

    const { result } = renderHook(() => useAsync(callback))

    await waitFor(() => {
      expect(result.current[0]).toBe('first')
    })

    const triggerReload = result.current[3]

    act(() => {
      triggerReload()
    })

    await waitFor(() => {
      expect(result.current[0]).toBe('second')
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should re-run when callback changes', async () => {
    const callback1 = vi.fn(() => Promise.resolve('one'))
    const callback2 = vi.fn(() => Promise.resolve('two'))

    const { result, rerender } = renderHook(({ cb }) => useAsync(cb), {
      initialProps: { cb: callback1 },
    })

    await waitFor(() => {
      expect(result.current[0]).toBe('one')
    })

    rerender({ cb: callback2 })

    await waitFor(() => {
      expect(result.current[0]).toBe('two')
    })

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  it('should set loading true when callback changes', async () => {
    const callback1 = vi.fn(() => Promise.resolve('one'))
    const callback2 = vi.fn(() => Promise.resolve('two'))

    const { result, rerender } = renderHook(({ cb }) => useAsync(cb), {
      initialProps: { cb: callback1 },
    })

    await waitFor(() => {
      expect(result.current[2]).toBe(false)
    })

    rerender({ cb: callback2 })

    expect(result.current[2]).toBe(true)
  })
})
