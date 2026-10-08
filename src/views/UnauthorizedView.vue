<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="unauthorized flex flex-col gap-4 justify-center px-4">
    <h1 class="text-2xl font-bold">Access denied</h1>
    <p>You need to sign in with an authorized Google account to use this page.</p>
    <router-link
      to="/login"
      class="bg-google-blue hover:bg-google-blue-dark text-white w-fit rounded-md px-4 py-2 cursor-pointer transition-colors duration-200"
      >Go to sign in</router-link
    >
    <router-link to="/" class="underline text-blue-700"> Back to Home ← </router-link>
  </div>
</template>
