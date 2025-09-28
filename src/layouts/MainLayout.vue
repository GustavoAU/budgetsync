<!-- src/layouts/DefaultLayout.vue -->
<script setup>
import MainHeader from '@/components/MainHeader.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="bg-gradient-to-t from-[#9eabc2] to-[#d2ebe2] text-white py-6 mt-auto">
      <div
        class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-sm text-center md:text-left">
          © {{ new Date().getFullYear() }} Budget Organizer. All rights reserved.
        </p>
        <div class="flex gap-4 text-sm">
          <a href="#" class="hover:underline">Privacy Policy</a>
          <a href="#" class="hover:underline">Terms of Service</a>
          <a href="#" class="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>
