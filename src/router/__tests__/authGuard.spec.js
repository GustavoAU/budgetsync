import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { ERROR_CODES } from '@/constants/errorCodes'

const getUser = vi.fn()
vi.mock('@/composables/useGoogleOAuth', () => ({
  useGoogleOAuth: () => ({ getUser }),
}))

const { authGuard } = await import('../authGuard')

const protectedRoute = { fullPath: '/budget-organizer', meta: { requiresAuth: true } }

describe('authGuard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getUser.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('lets public routes through without checking the session', async () => {
    const next = vi.fn()

    await authGuard({ fullPath: '/', meta: {} }, {}, next)

    expect(next).toHaveBeenCalledWith()
    expect(getUser).not.toHaveBeenCalled()
  })

  it('lets a signed-in user through without calling Google again', async () => {
    const auth = useAuthStore()
    auth.setToken('abc', 3600)
    auth.setUserProfile({ name: 'Ana' })
    const next = vi.fn()

    await authGuard(protectedRoute, {}, next)

    expect(next).toHaveBeenCalledWith()
    expect(getUser).not.toHaveBeenCalled()
  })

  it('loads the profile when there is a token but no user yet', async () => {
    const auth = useAuthStore()
    auth.setToken('abc', 3600)
    getUser.mockResolvedValue({ name: 'Ana' })
    const next = vi.fn()

    await authGuard(protectedRoute, {}, next)

    expect(getUser).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledWith()
  })

  it('sends a visitor without a session to the access denied page and remembers where they were going', async () => {
    const auth = useAuthStore()
    getUser.mockRejectedValue(
      Object.assign(new Error('Unauthorized'), { code: ERROR_CODES.UNAUTHORIZED_ACCESS }),
    )
    const next = vi.fn()

    await authGuard(protectedRoute, {}, next)

    expect(next).toHaveBeenCalledWith({ name: 'Unauthorized' })
    expect(auth.consumeRedirectPath()).toBe('/budget-organizer')
  })

  it('clears an invalid session and goes back home', async () => {
    const auth = useAuthStore()
    auth.setToken('expired', 3600)
    getUser.mockRejectedValue(
      Object.assign(new Error('Session invalid'), { code: ERROR_CODES.SESSION_INVALID }),
    )
    const next = vi.fn()

    await authGuard(protectedRoute, {}, next)

    expect(next).toHaveBeenCalledWith({ path: '/' })
    expect(auth.accessToken).toBeNull()
  })
})
