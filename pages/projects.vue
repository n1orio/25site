<script setup lang="ts">
import { projects } from "~/config"
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Мои работы</h2>
      <WaveDivider class="flex-1" />
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="project in projects"
        :key="project.title"
        class="ds-card ds-card-hover p-6 flex flex-col relative"
      >
        <div class="flex items-start justify-between gap-3 mb-4">
          <span
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style="background: color-mix(in srgb, var(--accent-contrast) 18%, transparent); color: var(--accent-contrast)"
          >
            <Icon :name="project.icon" size="24" class="w-6 h-6" />
          </span>

          <div v-if="project.links.length" class="flex items-center gap-2 flex-shrink-0">
            <a
              v-for="link in project.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="ds-action"
            >
              <Icon :name="link.icon" size="14" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <h3 class="ds-title text-lg mb-2">{{ project.title }}</h3>
        <p class="ds-body text-sm mb-5 flex-1">{{ project.desc }}</p>

        <div class="flex flex-wrap gap-2">
          <span v-for="tag in project.tags" :key="tag" class="ds-pill">{{ tag }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
