<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: var(--bg-primary)">
    <div class="text-center">
      <h1 class="font-heading font-black text-8xl sm:text-9xl" style="color: var(--accent)">
        404
      </h1>
      <p class="mt-4 text-lg font-medium" style="color: var(--text-secondary)">
        Такой страницы нет
      </p>
      <NuxtLink
        to="/"
        class="inline-block mt-8 px-6 py-3 font-bold text-sm transition-all duration-300"
        style="color: var(--accent-contrast); background: var(--accent); border-radius: var(--radius-pill)">
        На главную
      </NuxtLink>
    </div>
  </div>
</template>
