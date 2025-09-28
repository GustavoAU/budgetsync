<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="h-auto">
    <div
      class="flex justify-between items-center p-4 bg-gradient-to-tl from-[#d2ebe2] to-[#9eabc2] drop-shadow-md"
    >
      <router-link to="/">
        <img
          src="/src/assets/budget-logo.png"
          alt="budget logo"
          class="w-14 h-14 rounded-full drop-shadow-xl"
        />
      </router-link>

      <h1 class="flex items-center text-white text-2xl drop-shadow-md">Budget Organizer</h1>
      <router-link to="/">
        <img
          src="/src/assets/budget-logo.png"
          alt="budget logo"
          class="w-14 h-14 rounded-full drop-shadow-xl"
        />
      </router-link>
    </div>
  </header>
</template>
