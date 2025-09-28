<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useGoogleOAuth } from '@/composables/useGoogleOAuth'
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

const { logout } = useGoogleOAuth()

const authStore = useAuthStore()

const logoProfile = computed(() => {
  return authStore.userProfile?.picture ?? null
})
</script>

<template>
  <MainLayout>
    <div class="p-4">
      <h1 class="text-2xl font-bold">Montly Budget</h1>

      <div v-if="authStore.userProfile" class="mt-4">
        <p>Welcome, {{ authStore.userProfile.name }}</p>

        <img v-if="logoProfile" :src="logoProfile" class="w-12 h-12 rounded-full" />
      </div>
      <button
        @click="logout"
        class="bg-gray-300 hover:bg-gray-600 text-white rounded-xl px-4 py-2 cursor-pointer transition-colors duration-200 mt-6"
      >
        Log out
      </button>
    </div>
  </MainLayout>
</template>
