import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { ReactNode } from 'react'
import { hasRole } from '../utils/role_utils'
import Unauthorized from '../pages/Errors/Unauthorized'

const PrivateRoute = ({
  children,
  roles,
}: {
  children: ReactNode
  roles?: string[][]
}) => {
  const { user, logout } = useAuth()

  if (!user) return <Navigate to="/login" />

  const expiry = localStorage.getItem('login expiry')
  if (!expiry || new Date(expiry) < new Date()) {
    logout()
    return <Navigate to="/login" />
  }

  if (user.reset_password && location.pathname != '/reset-password')
    return <Navigate to="/reset-password" />

  if (
    roles &&
    !roles.some((roleGroup) => roleGroup.every((role) => hasRole(user, role)))
  )
    return <Unauthorized />

  return children
}

export default PrivateRoute
