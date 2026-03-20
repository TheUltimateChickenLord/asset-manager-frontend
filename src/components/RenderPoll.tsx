import { Alert } from '@mui/material'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const HEALTH_URL = `${import.meta.env.VITE_BACKEND_URL}/health`

const RenderPoll = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const res = await fetch(HEALTH_URL, { method: 'GET' })
        if (res.ok) {
          const text = await res.json()
          if (text == 'Success') {
            setIsReady(true)
            return true
          }
        }
      } catch (err) {
        // Backend still isn't online
      }
      return false
    }

    const wakeUpLoop = async () => {
      const alive = await checkHealth()

      if (!isMounted) return

      if (!alive) {
        timeoutRef.current = setTimeout(wakeUpLoop, 2000)
      } else {
        intervalRef.current = setInterval(
          () => {
            fetch(HEALTH_URL).catch(() => {})
          },
          5 * 60 * 1000,
        )
      }
    }

    wakeUpLoop()

    return () => {
      isMounted = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (!isReady) {
    return (
      <Alert severity="warning">
        Waking up server... this may take a few minutes.
      </Alert>
    )
  }

  return children
}

export default RenderPoll
