import { useState, useTransition } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import PasswordField from '../components/PasswordField'

const Login = () => {
  const { login, user } = useAuth()
  const [form, setForm] = useState({ name: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      if (await login(form.name, form.password)) {
        navigate('/')
      } else {
        setError('Invalid credentials')
      }
    })
  }

  if (user) return <Navigate to="/" />

  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: '16px' }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" marginBottom={2}>
          Login
        </Typography>
        <form action={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <AccountCircle
                        sx={{ color: 'action.active', marginRight: '10px' }}
                      />
                    ),
                  },
                }}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <PasswordField fullWidth form={form} setForm={setForm} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
              >
                Login
              </Button>
            </Grid>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
