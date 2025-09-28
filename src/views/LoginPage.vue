<script setup>
import { onMounted } from 'vue'
import { useGoogleOAuth } from '@/composables/useGoogleOAuth'
import { useAuthStore } from '@/stores/useAuthStore'
import MainLayout from '@/layouts/MainLayout.vue'

const { login, initGoogleClient } = useGoogleOAuth()
const auth = useAuthStore()

onMounted(() => {
  initGoogleClient()
})
</script>

<template>
  <MainLayout>
    <div class="fixed left-1/2 top-1/2 transform -translate-1/2">
      <h1 class="mb-2 text-lg font-semibold text-gray-800">Login:</h1>
      <button
        @click="login"
        class="bg-google-blue hover:bg-google-blue-dark text-white rounded-xl px-4 py-2 cursor-pointer transition-colors duration-200"
      >
        Login con Google
      </button>
      <div
        v-if="auth.isLoggingIn"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-6 shadow-lg text-center">
          <div
            class="animate-spin h-6 w-6 mx-auto mb-2 border-4 border-blue-500 border-t-transparent rounded-full"
          ></div>
          <p class="text-gray-700 font-medium">Redirigiendo, por favor espera...</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
