<template>
  <div class="min-h-screen bg-[#f4f4f5] dark:bg-[#000000] flex items-center justify-center p-6 transition-colors duration-700">
    <div class="text-center">
      <h1 class="font-heading font-black text-8xl sm:text-9xl tracking-tighter"
        :style="{ color: 'var(--accent)' }">
        404
      </h1>
      <p class="mt-4 text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        Такой страницы нет
      </p>
      <NuxtLink to="/"
        class="inline-block mt-8 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300"
        :style="{
          color: 'white',
          backgroundColor: 'var(--accent)',
        }">
        На главную
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { primaryColor } = useSecretTheme()
</script>
