import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const expiresAt = ref(null)
  const userProfile = ref(null)
  const redirectAfterLogin = ref(null)
  const isLoggingIn = ref(false)

  const isTokenValid = computed(() => {
    return accessToken.value && expiresAt.value && Date.now() < expiresAt.value
  })

  function setToken(token, expiresIn) {
    accessToken.value = token
    expiresAt.value = Date.now() + expiresIn * 1000
  }

  function clearToken() {
    accessToken.value = null
    expiresAt.value = null
  }

  function setUserProfile(profile) {
    userProfile.value = profile
  }

  function setRedirectPath(path) {
    redirectAfterLogin.value = path
  }

  function consumeRedirectPath() {
    const path = redirectAfterLogin.value
    redirectAfterLogin.value = null
    return path
  }

  function setLoggingIn(state) {
    isLoggingIn.value = state
  }

  return {
    accessToken,
    expiresAt,
    isTokenValid,
    setToken,
    clearToken,
    userProfile,
    setUserProfile,
    redirectAfterLogin,
    setRedirectPath,
    consumeRedirectPath,
    isLoggingIn,
    setLoggingIn,
  }
})
