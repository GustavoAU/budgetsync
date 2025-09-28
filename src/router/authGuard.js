// src/router/authGuard.js
import { useAuthStore } from '@/stores/useAuthStore'
import { useGoogleOAuth } from '@/composables/useGoogleOAuth'
import { ERROR_CODES } from '@/constants/errorCodes'

export async function authGuard(to, from, next) {
  const auth = useAuthStore()
  const { getUser } = useGoogleOAuth()

  if (!to.meta.requiresAuth) {
    return next()
  }
  if (auth.accessToken && auth.userProfile) {
    return next()
  }

  try {
    await getUser()

    return next()
  } catch (err) {
    console.error('❌ authGuard falló:', err)

    auth.clearToken()
    auth.setRedirectPath(to.fullPath)

    if (err.code === ERROR_CODES.UNAUTHORIZED_ACCESS) {
      return next({ name: 'Unauthorized' })
    } else {
      return next({ path: '/' })
    }
  }
}
