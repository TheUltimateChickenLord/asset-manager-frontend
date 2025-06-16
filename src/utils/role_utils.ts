import type { Label, User } from '../api/interfaces'

export function hasRole(user: User, role: string) {
  return labelsFromRoles(user, role).length > 0
}

export function hasRoleAccess(user: User, role: string, scopes: Label[]) {
  return hasRoleAccessString(
    user,
    role,
    scopes.map((scope) => scope.name),
  )
}

export function hasRoleAccessString(
  user: User,
  role: string,
  scopes: string[],
) {
  // get all the roles from the user that match the role you are looking for
  const roles = user.roles.filter((userRole) => userRole.role == role)
  // if one of them is a * then return true
  if (roles.find((role) => role.scope == '*')) return true
  // ensure that they have all the roles required
  return scopes.every((scope) => roles.find((role) => role.scope == scope))
}

export function hasScopeAll(user: User, role: string) {
  return (
    user.roles.find(
      (userRole) => userRole.role == role && userRole.scope == '*',
    ) != undefined
  )
}

export function labelsFromRoles(user: User, role: string) {
  return user.roles.filter((userRole) => userRole.role == role)
}
