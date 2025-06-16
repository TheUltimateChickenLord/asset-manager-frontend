import { CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import { ThemeProviderCustom } from './context/ThemeContext'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { HistoryProvider } from './context/HistoryContext'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProviderCustom>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <HistoryProvider>
              <AppRoutes />
            </HistoryProvider>
          </Router>
        </AuthProvider>
      </ThemeProviderCustom>
    </LocalizationProvider>
  )
}

export default App
