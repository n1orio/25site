<template>
  <footer class="w-full pt-6 mt-16" style="border-top: 1px solid var(--border-subtle)">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <p class="ds-meta">
        <span style="color: var(--text-primary)">Niorio</span> · MIT · {{ new Date().getFullYear() }}
      </p>
      <p class="ds-meta">
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
  color: var(--accent);
  font-weight: 700;
  transition: opacity 0.3s ease;
}
.footer-link:hover { opacity: 0.7; }
</style>
