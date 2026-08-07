<template>
  <footer class="w-full py-6 mt-12 border-t border-zinc-200 dark:border-white/5 transition-colors duration-700">
    <div class="flex flex-col items-center gap-2">
      <p class="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-700">
        <a href="https://github.com/n1orio/25site" target="_blank" rel="noopener noreferrer"
          class="footer-link font-bold">Niorio</a>
        <span class="mx-2 opacity-60">·</span>
        <span>MIT</span>
        <span class="mx-2 opacity-60">·</span>
        <span>{{ new Date().getFullYear() }}</span>
      </p>
      <p class="text-[10px] text-zinc-400 dark:text-zinc-500 transition-colors duration-700">
        Сделано на
        <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="footer-link">Nuxt</a>
        <span class="mx-1 opacity-60">+</span>
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="footer-link">Tailwind</a>
        <span class="mx-1 opacity-60">+</span>
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="footer-link">Vue</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: color-mix(in srgb, var(--accent) 35%, currentColor);
  font-weight: 700;
  transition: color 0.3s ease;
}
.footer-link:hover {
  color: var(--accent);
}
</style>