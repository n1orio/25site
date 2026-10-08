<script setup lang="ts">
import { socials } from "~/config"

const { copy, copiedKey } = useCopy()
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Связь</h2>
      <WaveDivider class="flex-1" />
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="social in socials"
        :key="social.name"
        class="ds-card ds-card-hover p-5 flex items-center gap-4 group relative"
      >
        <a
          :href="social.url"
          target="_blank"
          rel="noopener"
          class="contents"
          :aria-label="`Открыть ${social.name}`"
        >
          <span
            class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            :style="{ background: 'color-mix(in srgb, var(--accent-contrast) 18%, transparent)' }"
          >
            <Icon :name="social.icon" size="20" class="w-5 h-5" :style="{ color: 'var(--accent-contrast)' }" />
          </span>
        </a>

        <a :href="social.url" target="_blank" rel="noopener" class="min-w-0 flex-1">
          <h3 class="ds-title text-base mb-0.5">{{ social.name }}</h3>
          <p class="ds-body text-xs leading-snug truncate">{{ social.desc }}</p>
        </a>

        <button
          class="ds-action flex-shrink-0"
          :aria-label="`Скопировать ссылку ${social.name}`"
          :title="`Скопировать ссылку ${social.name}`"
          @click="copy(social.url, social.name)"
        >
          <Icon
            :name="copiedKey === social.name ? 'lucide:check' : 'lucide:link'"
            size="14"
            class="w-3.5 h-3.5"
          />
        </button>
      </div>
    </div>

    <p v-if="copiedKey" class="on-bg-meta mt-3">
      Ссылка на {{ copiedKey }} скопирована
    </p>

    <Donations />
  </section>
</template>
