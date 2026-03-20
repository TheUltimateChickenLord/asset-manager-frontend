import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { HistoryProvider } from '../../src/context/HistoryContext'
import { useHistory } from '../../src/hooks/useHistory'

const Consumer = () => {
  const value = useHistory()
  return <span data-testid="history">{value ?? 'null'}</span>
}

const Navigator = ({ to }: { to: string }) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to)
  }, [to, navigate])

  return null
}

describe('HistoryProvider', () => {
  it('provides null initially', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HistoryProvider>
          <Consumer />
        </HistoryProvider>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('history')).toHaveTextContent('null')
  })

  it('returns parent path when navigating within same section', async () => {
    render(
      <MemoryRouter initialEntries={['/assets/1']}>
        <HistoryProvider>
          <Navigator to="/assets/2" />
          <Routes>
            <Route path="/assets/:id" element={<Consumer />} />
          </Routes>
        </HistoryProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByTestId('history')).toHaveTextContent('/assets')
  })

  it('handles deeper same-section navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/assets/1/details']}>
        <HistoryProvider>
          <Navigator to="/assets/1/edit" />
          <Routes>
            <Route path="/assets/:id/:tab" element={<Consumer />} />
          </Routes>
        </HistoryProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByTestId('history')).toHaveTextContent('/assets/1')
  })

  it('returns null when there is no previous location yet', async () => {
    render(
      <MemoryRouter initialEntries={['/assets']}>
        <HistoryProvider>
          <Consumer />
        </HistoryProvider>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('history')).toHaveTextContent('null')
  })
})
