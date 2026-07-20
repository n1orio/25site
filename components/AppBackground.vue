<template>
  <div class="fixed inset-0 z-0 pointer-events-none bg-[#f4f4f5] dark:bg-[#000000] transition-colors duration-700"></div>
  <div class="fixed inset-[-50%] z-0 pointer-events-none blur-[120px] saturate-150 opacity-50 dark:opacity-[0.1] transition-[opacity] duration-700">
    <div class="absolute inset-0 transition-all duration-700" :style="{ background: `radial-gradient(ellipse at 30% 20%, var(--bg-1) 0%, transparent 60%)` }"></div>
    <div class="absolute inset-0 transition-all duration-700" :style="{ background: `radial-gradient(ellipse at 70% 80%, var(--bg-2) 0%, transparent 60%)` }"></div>
  </div>
</template>
