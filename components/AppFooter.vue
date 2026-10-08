<template>
  <footer class="w-full py-6 mt-16 border-t border-black/10 dark:border-white/10 transition-colors duration-700">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <p class="v2-label normal-case tracking-normal">
        <span class="font-bold">Niorio</span> · MIT · {{ new Date().getFullYear() }}
      </p>
      <p class="v2-label normal-case tracking-normal">
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
