<template>
  <footer class="w-full py-6 mt-12 border-t border-zinc-200 dark:border-white/5 transition-colors duration-700">
    <div class="flex flex-col items-center gap-2">
      <p class="text-xs text-zinc-400 dark:text-zinc-600">
        <a href="https://github.com/n1orio/25site" target="_blank" rel="noopener noreferrer"
          class="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
          Niorio
        </a>
        <span class="mx-2">·</span>
        <span>MIT</span>
        <span class="mx-2">·</span>
        <span>{{ new Date().getFullYear() }}</span>
      </p>
      <p class="text-[10px] text-zinc-300 dark:text-zinc-700">
        Сделано на
        <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 dark:hover:text-zinc-500 transition-colors">Nuxt</a>
        <span class="mx-1">+</span>
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 dark:hover:text-zinc-500 transition-colors">Tailwind</a>
        <span class="mx-1">+</span>
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 dark:hover:text-zinc-500 transition-colors">Vue</a>
      </p>
    </div>
  </footer>
</template>
