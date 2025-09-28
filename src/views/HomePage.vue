<script setup>
import { useGoogleOAuth } from '@/composables/useGoogleOAuth'
import MainLayout from '@/layouts/MainLayout.vue'

const { login } = useGoogleOAuth()
</script>
<template>
  <MainLayout>
    <main class="flex flex-col min-h-screen">
      <section class="hero flex flex-grow justify-center items-center">
        <div class="flex justify-around items-center w-full">
          <div class="flex flex-col justify-center">
            <h2 class="text-6xl font-bold mb-6">
              Take control of your finances <br />
              & budgeting
            </h2>
            <p class="text-4xl">All your accounts, one easy tracker</p>
            <div class="mt-6">
              <button
                @click="login"
                class="bg-google-blue hover:bg-google-blue-dark text-white rounded-xl px-4 py-2 cursor-pointer transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
          <div class="relative w-2/16 flex">
            <img src="/src/assets/hero-phone-image.png" alt="" class="drop-shadow-xl" />
            <div
              class="absolute inset-0 blur-2xl opacity-30 top-1/2 left-1/2 transform -translate-1/2 bg-gradient-to-tl from-[rgb(97,70,219)] to-[#1cb4a8] w-200 h-200 rounded-full -z-10"
            ></div>
          </div>
        </div>
      </section>
    </main>
  </MainLayout>
</template>
