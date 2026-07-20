<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    <div
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full"
    >
      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6"
        >
          <Icon name="lucide:bot" class="w-6 h-6" />
        </div>
        <h3
          class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors"

        >
          25bot
        </h3>
        <p
          class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors"

        >
          Открытый Discord бот — бесплатная альтернатива MEE6. Тикеты, экономика, временные голосовые каналы, модерация, игры, TikTok постинг.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Python
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          discord.py
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          MongoDB
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mt-3">
        <a
          href="https://github.com/n1orio/25bot"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon name="mdi:github" class="w-4 h-4" />
          GitHub
        </a>
      </div>
    </div>

    <div
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full card-no-hover"
    >
      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6"
        >
          <Icon name="lucide:globe" class="w-6 h-6" />
        </div>
        <h3
          class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors"

        >
          Личный Сайт v2
        </h3>
        <p
          class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors"

        >
          Этот самый сайт, с современным дизайном, плавной анимацией и кучей пасхалок.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Nuxt 4
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Tailwind
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Bun
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          TypeScript
        </span>
      </div>
    </div>

    <div
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full"
    >
      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6"
        >
          <Icon name="lucide:zap" class="w-6 h-6" />
        </div>
        <h3
          class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors"

        >
          TFMG Energy Connector
        </h3>
        <p
          class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors"

        >
          Мод для Minecraft, который конвертирует энергию из Create: TFMG в Fe
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Minecraft
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          NeoForge
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Kotilin
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mt-3">
        <a
          href="https://github.com/n1orio/TFMG-Energy-Connector"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon name="mdi:github" class="w-4 h-4" />
          GitHub
        </a>
        <a
          href="https://modrinth.com/mod/tfmg-energy-converter"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon name="simple-icons:modrinth" class="w-4 h-4" />
          Modrinth
        </a>
      </div>
    </div>

    <div
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full"
    >
      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6"
        >
          <Icon name="lucide:wind" class="w-6 h-6" />
        </div>
        <h3
          class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors"

        >
          Breeze Site
        </h3>
        <p
          class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors"

        >
          Сайт для невышедшего майнкрафт сервера Breeze
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Next.js
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          TypeScript
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Prisma
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Bun
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mt-3">
        <a
          href="https://github.com/n1orio/breeze-site"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon name="mdi:github" class="w-4 h-4" />
          GitHub
        </a>
      </div>
    </div>

    <div
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full"
    >
      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6"
        >
          <Icon name="lucide:languages" class="w-6 h-6" />
        </div>
        <h3
          class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors"

        >
          Auto Mod Translator
        </h3>
        <p
          class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors"

        >
          Скрипт на Python, который автоматически переводит моды Minecraft на русский через Google Translate.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Python
        </span>
        <span
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          Minecraft
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mt-3">
        <a
          href="https://github.com/n1orio/Minecraft-Auto-Mod-Translator"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon name="mdi:github" class="w-4 h-4" />
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// Сетка проектов
// Проект 1
// Проект 2 (без ховера)
// Проект 3
// Проект 4
// Проект 5
</script>

<style>
/* Без ховер-подъёма у второй карточки */
.card-no-hover.theme-card:hover {
  background: rgba(255, 255, 255, 0.65) !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
  transform: none !important;
}

.dark .card-no-hover.theme-card:hover {
  background: rgba(24, 24, 27, 0.55) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
  transform: none !important;
}
</style>

