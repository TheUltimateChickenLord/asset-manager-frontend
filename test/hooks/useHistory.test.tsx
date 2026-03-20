import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { HistoryContext, useHistory } from '../../src/hooks/useHistory'

describe('HistoryContext / useHistory', () => {
  it('should return null when no provider is used', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current).toBeNull()
  })

  it('should return the value from provider', () => {
    const testValue = '/home'

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HistoryContext.Provider value={testValue}>
        {children}
      </HistoryContext.Provider>
    )

    const { result } = renderHook(() => useHistory(), { wrapper })

    expect(result.current).toBe(testValue)
  })
})