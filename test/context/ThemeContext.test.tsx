import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProviderCustom } from '../../src/context/ThemeContext'
import { ThemeContext } from '../../src/hooks/useThemeMode'

vi.mock('@mui/material', async () => {
  const actual =
    await vi.importActual<typeof import('@mui/material')>('@mui/material')
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  }
})

import { useMediaQuery } from '@mui/material'

describe('ThemeProviderCustom', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const Consumer = () => (
    <ThemeContext.Consumer>
      {(value) => (
        <>
          <span data-testid="mode">{value.mode}</span>
          <button onClick={value.toggleTheme}>toggle</button>
        </>
      )}
    </ThemeContext.Consumer>
  )

  it('defaults to system mode', async () => {
    ;(useMediaQuery as any).mockReturnValue(false)

    render(
      <ThemeProviderCustom>
        <Consumer />
      </ThemeProviderCustom>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('system'),
    )
  })

  it('loads saved mode from localStorage', async () => {
    localStorage.setItem('themeMode', 'dark')
    ;(useMediaQuery as any).mockReturnValue(false)

    render(
      <ThemeProviderCustom>
        <Consumer />
      </ThemeProviderCustom>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('dark'),
    )
  })

  it('toggles light → dark → system → light', async () => {
    ;(useMediaQuery as any).mockReturnValue(false)

    render(
      <ThemeProviderCustom>
        <Consumer />
      </ThemeProviderCustom>,
    )

    const button = screen.getByText('toggle')

    // system → light
    fireEvent.click(button)
    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('light'),
    )
    expect(localStorage.getItem('themeMode')).toBe('light')

    // light → dark
    fireEvent.click(button)
    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('dark'),
    )
    expect(localStorage.getItem('themeMode')).toBe('dark')

    // dark → system
    fireEvent.click(button)
    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('system'),
    )
    expect(localStorage.getItem('themeMode')).toBe('system')
  })

  it('system mode uses prefersDarkMode=true', async () => {
    ;(useMediaQuery as any).mockReturnValue(true)

    render(
      <ThemeProviderCustom>
        <Consumer />
      </ThemeProviderCustom>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('system'),
    )
  })

  it('system mode uses prefersDarkMode=false', async () => {
    ;(useMediaQuery as any).mockReturnValue(false)

    render(
      <ThemeProviderCustom>
        <Consumer />
      </ThemeProviderCustom>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('mode')).toHaveTextContent('system'),
    )
  })
})
