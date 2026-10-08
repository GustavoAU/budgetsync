import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stores the token with its expiry time', () => {
    const auth = useAuthStore()

    auth.setToken('abc', 3600)

    expect(auth.accessToken).toBe('abc')
    expect(auth.expiresAt).toBe(Date.now() + 3600 * 1000)
    expect(auth.isTokenValid).toBe(true)
  })

  it('treats the token as invalid once it expires', () => {
    const auth = useAuthStore()
    auth.setToken('abc', 60)

    vi.advanceTimersByTime(61 * 1000)

    expect(auth.isTokenValid).toBe(false)
  })

  it('clears the token on logout', () => {
    const auth = useAuthStore()
    auth.setToken('abc', 3600)

    auth.clearToken()

    expect(auth.accessToken).toBeNull()
    expect(auth.isTokenValid).toBeFalsy()
  })

  it('returns the saved redirect path only once', () => {
    const auth = useAuthStore()
    auth.setRedirectPath('/budget-organizer')

    expect(auth.consumeRedirectPath()).toBe('/budget-organizer')
    expect(auth.consumeRedirectPath()).toBeNull()
  })
})
