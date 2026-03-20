import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useConfirm from '../../src/hooks/useConfirm'

describe('useConfirm', () => {
  it('should initialize with false', () => {
    const { result } = renderHook(() => useConfirm())
    const [openConfirm] = result.current
    expect(openConfirm).toBe(false)
  })

  it('should open the confirm', () => {
    const { result } = renderHook(() => useConfirm())
    const [, open] = result.current

    act(() => {
      open()
    })

    const [openConfirm] = result.current
    expect(openConfirm).toBe(true)
  })

  it('should close the confirm', () => {
    const { result } = renderHook(() => useConfirm())
    const [, open, close] = result.current

    act(() => {
      open()
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      close()
    })

    expect(result.current[0]).toBe(false)
  })
})