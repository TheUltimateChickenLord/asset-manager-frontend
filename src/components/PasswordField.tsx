import { useState } from 'react'
import { TextField, IconButton, type TextFieldProps } from '@mui/material'
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material'

interface FormInput {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const PasswordField = ({
  label = 'Password',
  form,
  setForm,
  name = 'password',
  ...props
}: {
  label?: string
  form: FormInput
  setForm: unknown
  name?: string
} & Omit<TextFieldProps, 'variant'>) => {
  const [showPassword, setShowPassword] = useState(false)
  const setFormValues = setForm as React.SetStateAction<
    React.Dispatch<FormInput>
  >

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <TextField
      {...props}
      label={label}
      variant="outlined"
      type={showPassword ? 'text' : 'password'}
      value={form[name]}
      onChange={(e) =>
        setFormValues((form) => ({ ...form, [name]: e.target.value }))
      }
      slotProps={{
        input: {
          startAdornment: (
            <Lock sx={{ color: 'action.active', marginRight: '10px' }} />
          ),
          endAdornment: (
            <IconButton
              onClick={handleClickShowPassword}
              edge="end"
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        },
      }}
      required
    />
  )
}

export default PasswordField
