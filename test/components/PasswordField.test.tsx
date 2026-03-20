import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PasswordField from '../../src/components/PasswordField'

describe('PasswordField', () => {
  let form: { [key: string]: string }
  let setForm: (update: any) => void

  beforeEach(() => {
    form = { password: '' }
    setForm = vi.fn((fn) => {
      if (typeof fn === 'function') form = fn(form)
      else form = fn
    })
  })

  it('renders with default label', () => {
    render(<PasswordField form={form} setForm={setForm} />)
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<PasswordField form={form} setForm={setForm} label="New Password" />)
    expect(screen.getByLabelText(/^New Password/)).toBeInTheDocument()
  })

  it('toggles password visibility when icon clicked', () => {
    render(<PasswordField form={form} setForm={setForm} />)
    const input = screen.getByLabelText(/^Password/) as HTMLInputElement
    const toggleButton = screen.getByLabelText('toggle password visibility')

    // default should be password
    expect(input.type).toBe('password')

    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')

    fireEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('updates form value on input change', () => {
    render(<PasswordField form={form} setForm={setForm} />)
    const input = screen.getByLabelText(/^Password/) as HTMLInputElement

    fireEvent.change(input, { target: { value: 'mypassword' } })
    expect(setForm).toHaveBeenCalled()
    expect(form.password).toBe('mypassword')
  })
})