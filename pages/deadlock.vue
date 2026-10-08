<script setup lang="ts">
import type { DeadlockData } from "~/types/deadlock"

const { data } = await useFetch<DeadlockData | null>("/api/deadlock")
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Deadlock</h2>
      <a href="https://ddlk.bio/profile/niorio" target="_blank" rel="noopener"
        class="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-wider transition-colors"
        style="background: var(--accent); color: var(--accent-contrast)">
        ddlk.bio <Icon name="lucide:arrow-up-right" size="12" class="w-3 h-3" />
      </a>
      <WaveDivider class="flex-1" />
    </header>

    <DeadlockStats :data="data" />
  </section>
</template>
