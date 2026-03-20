import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeContext, useThemeMode } from '../../src/hooks/useThemeMode'

describe('ThemeContext / useThemeMode', () => {
  it('should return default values when no provider is used', () => {
    const { result } = renderHook(() => useThemeMode())
    const { mode, toggleTheme } = result.current

    expect(mode).toBe('light')
    expect(typeof toggleTheme).toBe('function')

    act(() => {
      toggleTheme()
    })

    // Default toggleTheme does nothing, so no state change expected
    expect(result.current.mode).toBe('light')
  })

  it('should use values from ThemeContext provider', () => {
    const toggleMock = vi.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={{ mode: 'dark', toggleTheme: toggleMock }}>
        {children}
      </ThemeContext.Provider>
    )

    const { result } = renderHook(() => useThemeMode(), { wrapper })

    expect(result.current.mode).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(toggleMock).toHaveBeenCalled()
  })
})