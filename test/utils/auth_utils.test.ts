import { describe, it, expect } from 'vitest'
import { verifyPasswordComplexity } from '../../src/utils/auth_utils'

describe('verifyPasswordComplexity', () => {
  it('returns true for valid passwords', () => {
    const validPasswords = ['Abcdef1!', 'P@ssw0rd123!', 'XyZ9$abcd']

    validPasswords.forEach((pwd) => {
      expect(verifyPasswordComplexity(pwd)).toBe(true)
    })
  })

  it('returns false for passwords that are too short', () => {
    expect(verifyPasswordComplexity('Ab1!')).toBe(false)
    expect(verifyPasswordComplexity('A1!b')).toBe(false)
  })

  it('returns false if missing uppercase', () => {
    expect(verifyPasswordComplexity('abcdef1!')).toBe(false)
  })

  it('returns false if missing lowercase', () => {
    expect(verifyPasswordComplexity('ABCDEF1!')).toBe(false)
  })

  it('returns false if missing digit', () => {
    expect(verifyPasswordComplexity('Abcdefg!')).toBe(false)
  })

  it('returns false if missing special character', () => {
    expect(verifyPasswordComplexity('Abcdef12')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(verifyPasswordComplexity('')).toBe(false)
  })
})
