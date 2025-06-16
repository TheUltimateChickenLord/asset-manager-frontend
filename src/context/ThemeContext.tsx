import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material'
import { ThemeContext } from '../hooks/useThemeMode'

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system')

  // Read user preference on first load
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'system'
    if (['light', 'dark', 'system'].includes(savedMode))
      setMode(savedMode as 'light' | 'dark' | 'system')
  }, [])

  const toggleTheme = () => {
    const nextMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
    setMode(nextMode)
    localStorage.setItem('themeMode', nextMode)
  }

  const currentMode: 'light' | 'dark' =
    mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode

  const theme = useMemo(
    () => createTheme({ palette: { mode: currentMode } }),
    [currentMode],
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
