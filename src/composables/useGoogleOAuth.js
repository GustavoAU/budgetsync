import { useAuthStore } from '@/stores/useAuthStore'

import { ref } from 'vue'
import router from '@/router'

import { ERROR_CODES } from '@/constants/errorCodes'

export function useGoogleOAuth() {
  const auth = useAuthStore()
  const isLoggingOut = ref(false)
  const DEFAULT_REDIRECT = '/budget-organizer'

  let googleClient = null
  let refreshPromise = null

  const initGoogleClient = () => {
    if (window.google && !googleClient) {
      googleClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: import.meta.env.VITE_GOOGLE_SCOPE,
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            auth.setLoggingIn(false)
            auth.setToken(tokenResponse.access_token, tokenResponse.expires_in)

            getUser()
            const redirectPath = auth.consumeRedirectPath()

            if (!isLoggingOut.value) router.push(redirectPath || DEFAULT_REDIRECT)
          } else {
            console.error('❌ No access token received in login flow')
          }
        },
        error_callback: (error) => {
          auth.setLoggingIn(false)
          console.error('❌ Google OAuth error:', error)
        },
      })
    }
  }

  const login = async () => {
    try {
      auth.setLoggingIn(true)
      if (!googleClient) initGoogleClient()
      googleClient.requestAccessToken({ prompt: 'consent' })
    } catch (err) {
      console.error('❌ Login error:', err)
      auth.setLoggingIn(false)
    }
  }

  const logout = async () => {
    isLoggingOut.value = true
    try {
      // 1) Revocar token
      if (window.google && auth.accessToken) {
        await new Promise((r) => window.google.accounts.oauth2.revoke(auth.accessToken, r))
      }

      // 2) Limpiar stores
      auth.clearToken()

      // 3) Redirigir
      router.push('/')
    } catch (e) {
      console.error(e)
      auth.clearToken()

      router.push('/')
    } finally {
      isLoggingOut.value = false
    }
  }
  const getUser = async () => {
    if (!auth.accessToken) {
      const error = new Error('Unauthorized')
      error.code = ERROR_CODES.UNAUTHORIZED_ACCESS
      throw error
    }
    await safeRefresh()

    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    })
    if (!res.ok) {
      const body = await res.text()
      console.error('❌ Failed to fetch user info:', res.status, body)
      const error = new Error('Session invalid')
      error.code = ERROR_CODES.SESSION_INVALID
      throw error
    }
    const user = await res.json()

    auth.setUserProfile(user)

    return user
  }

  const ensureFreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise

    if (
      !auth.accessToken ||
      typeof auth.accessToken !== 'string' ||
      Date.now() >= auth.expiresAt - 60000
    ) {
      if (!googleClient) initGoogleClient()

      refreshPromise = new Promise((resolve, reject) => {
        const finalize = () => {
          refreshPromise = null
        }

        const handleResponse = (tokenResponse) => {
          finalize()
          if (tokenResponse?.access_token) {
            auth.setToken(tokenResponse.access_token, tokenResponse.expires_in)
            resolve()
          } else {
            reject(new Error('❌ No access token received during refresh'))
          }
        }

        const handleError = () => {
          googleClient.error_callback = (err) => {
            finalize()
            reject(err)
          }

          googleClient.callback = (tokenResponse) => {
            finalize()
            if (tokenResponse?.access_token) {
              auth.setToken(tokenResponse.access_token, tokenResponse.expires_in)
              resolve()
            } else {
              reject(new Error('❌ No access token received during consent refresh'))
            }
          }

          googleClient.requestAccessToken({ prompt: 'consent' })
        }

        requestAccessTokenWithPrompt('none', handleResponse, handleError)
      })

      return refreshPromise
    }

    return Promise.resolve()
  }

  async function safeRefresh() {
    try {
      await ensureFreshAccessToken()
    } catch (err) {
      auth.clearToken()
      router.push('/')
      const sessionError = new Error('SESSION_INVALID')
      sessionError.cause = err
      throw sessionError
    }
  }

  function requestAccessTokenWithPrompt(prompt = 'none', onSuccess, onError) {
    googleClient.callback = onSuccess
    googleClient.error_callback = onError
    googleClient.requestAccessToken({ prompt })
  }

  return {
    login,
    logout,
    ensureFreshAccessToken,
    initGoogleClient,
    getUser,
    safeRefresh,
    requestAccessTokenWithPrompt,
  }
}
