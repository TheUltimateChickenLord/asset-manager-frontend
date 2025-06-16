import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { HistoryContext } from '../hooks/useHistory'

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const backFrom = useRef<string | null>(null)
  const prevLocation = useRef<string | null>(null)

  let value = prevLocation.current?.slice(0) || null

  useEffect(() => {
    prevLocation.current = location.pathname
  }, [location])

  if (value) {
    const currentSplit = location.pathname.split('/')
    const prevSplit = value.split('/')
    if (currentSplit[1] == prevSplit[1]) {
      value = currentSplit.slice(0, -1).join('/')
      backFrom.current = null
    } else {
      if (value == backFrom.current) {
        value = currentSplit.slice(0, -1).join('/')
        backFrom.current = null
      } else {
        backFrom.current = location.pathname
      }
    }
  } else {
    backFrom.current = null
  }

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  )
}
