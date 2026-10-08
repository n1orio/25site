<script setup lang="ts">
import type { DeadlockData } from "~/types/deadlock"

const { data } = await useFetch<DeadlockData | null>("/api/deadlock")
</script>

<template>
  <section class="v2-section">
    <header class="flex items-baseline gap-3 mb-3">
      <span class="v2-index">06</span>
      <h2 class="v2-label">Deadlock</h2>
      <a href="https://ddlk.bio/profile/niorio" target="_blank" rel="noopener"
        class="ml-auto text-[0.6875rem] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        ddlk.bio ↗
      </a>
    </header>

    <DeadlockStats :data="data" />
  </section>
</template>
