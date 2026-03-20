import { describe, it, expect } from 'vitest'
import { getDueDateInfo, addDays } from '../../src/utils/date_utils'

describe('getDueDateInfo', () => {
  it('returns "due today" if the date is today', () => {
    const today = new Date()
    const { message, days } = getDueDateInfo(today.toISOString())
    expect(message).toBe('due today')
    expect(days).toBe(0)
  })

  it('returns correct message for a future date', () => {
    const today = new Date()
    const future = new Date(today)
    future.setDate(today.getDate() + 3)

    const { message, days } = getDueDateInfo(future.toISOString())
    expect(message).toBe('due in 3 days')
    expect(days).toBe(3)
  })

  it('returns singular "day" for 1 day in the future', () => {
    const today = new Date()
    const future = new Date(today)
    future.setDate(today.getDate() + 1)

    const { message, days } = getDueDateInfo(future.toISOString())
    expect(message).toBe('due in 1 day')
    expect(days).toBe(1)
  })

  it('returns correct message for a past date', () => {
    const today = new Date()
    const past = new Date(today)
    past.setDate(today.getDate() - 5)

    const { message, days } = getDueDateInfo(past.toISOString())
    expect(message).toBe('due 5 days ago')
    expect(days).toBe(-5)
  })

  it('returns singular "day" for 1 day ago', () => {
    const today = new Date()
    const past = new Date(today)
    past.setDate(today.getDate() - 1)

    const { message, days } = getDueDateInfo(past.toISOString())
    expect(message).toBe('due 1 day ago')
    expect(days).toBe(-1)
  })
})

describe('addDays', () => {
  it('adds days correctly', () => {
    const date = new Date('2026-03-20')
    const newDate = addDays(date, 5)
    expect(newDate.getDate()).toBe(25)
    expect(newDate.getMonth()).toBe(2)
    expect(newDate.getFullYear()).toBe(2026)
  })

  it('subtracts days correctly when using negative numbers', () => {
    const date = new Date('2026-03-20')
    const newDate = addDays(date, -10)
    expect(newDate.getDate()).toBe(10)
    expect(newDate.getMonth()).toBe(2)
    expect(newDate.getFullYear()).toBe(2026)
  })

  it('does not mutate the original date', () => {
    const date = new Date('2026-03-20')
    const copy = addDays(date, 3)
    expect(date.getDate()).toBe(20)
    expect(copy.getDate()).toBe(23)
  })
})
