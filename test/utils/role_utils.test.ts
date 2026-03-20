import { describe, it, expect } from 'vitest'
import {
  hasRole,
  hasRoleAccess,
  hasRoleAccessString,
  hasScopeAll,
  labelsFromRoles,
} from '../../src/utils/role_utils'

describe('roles utils', () => {
  const user = {
    id: 1,
    name: 'Alice',
    roles: [
      { role: 'Admin', scope: '*' },
      { role: 'Editor', scope: 'project1' },
      { role: 'Editor', scope: 'project2' },
      { role: 'Viewer', scope: 'project1' },
    ],
  } as any

  describe('hasRole', () => {
    it('returns true if user has the role', () => {
      expect(hasRole(user, 'Admin')).toBe(true)
      expect(hasRole(user, 'Editor')).toBe(true)
      expect(hasRole(user, 'Viewer')).toBe(true)
    })

    it('returns false if user does not have the role', () => {
      expect(hasRole(user, 'NonExistent')).toBe(false)
    })
  })

  describe('labelsFromRoles', () => {
    it('returns all roles matching the given role name', () => {
      const labels = labelsFromRoles(user, 'Editor')
      expect(labels.length).toBe(2)
      expect(labels.map((r) => r.scope)).toEqual(['project1', 'project2'])
    })

    it('returns empty array if role not found', () => {
      expect(labelsFromRoles(user, 'NonExistent')).toEqual([])
    })
  })

  describe('hasScopeAll', () => {
    it('returns true if user has a role with scope "*"', () => {
      expect(hasScopeAll(user, 'Admin')).toBe(true)
    })

    it('returns false if user does not have wildcard scope', () => {
      expect(hasScopeAll(user, 'Editor')).toBe(false)
    })
  })

  describe('hasRoleAccessString', () => {
    it('returns true if user has wildcard scope for role', () => {
      expect(hasRoleAccessString(user, 'Admin', ['anything'])).toBe(true)
    })

    it('returns true if user has all required scopes', () => {
      expect(
        hasRoleAccessString(user, 'Editor', ['project1', 'project2']),
      ).toBe(true)
    })

    it('returns false if user missing one required scope', () => {
      expect(
        hasRoleAccessString(user, 'Editor', [
          'project1',
          'project2',
          'project3',
        ]),
      ).toBe(false)
    })

    it('returns false if user does not have the role', () => {
      expect(hasRoleAccessString(user, 'NonExistent', ['project1'])).toBe(false)
    })
  })

  describe('hasRoleAccess', () => {
    const scopes = [{ name: 'project1' }, { name: 'project2' }] as any

    it('returns true if user has all scopes for role', () => {
      expect(hasRoleAccess(user, 'Editor', scopes)).toBe(true)
    })

    it('returns false if user missing a scope', () => {
      const missingScope = [{ name: 'project1' }, { name: 'project3' }] as any
      expect(hasRoleAccess(user, 'Editor', missingScope)).toBe(false)
    })
  })
})
