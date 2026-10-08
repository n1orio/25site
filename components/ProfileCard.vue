<script setup lang="ts">
import { username } from "~/config"
defineProps<{
  discordAvatarUrl: string
  discordStatusColor: string
  bioTitle: string
  bioParagraph0: string
  bioParagraph1: string
  bioParagraph2: string
}>()
</script>

<template>
  <header class="w-full">
    <div class="flex items-center gap-4 mb-5">
      <div class="relative flex-shrink-0">
        <img
          :src="discordAvatarUrl"
          alt="avatar"
          class="w-20 h-20 object-cover"
          style="border-radius: var(--radius-card)"
        />
        <span
          class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--accent)]"
          :style="{ backgroundColor: discordStatusColor }" />
      </div>

      <div class="min-w-0">
        <h1 class="on-bg-title text-2xl sm:text-3xl mb-1.5">{{ username }}</h1>
        <p class="on-bg-meta">{{ bioTitle }}</p>
      </div>
    </div>

    <div class="on-bg-body space-y-2.5 max-w-prose">
      <p>{{ bioParagraph0 }}</p>
      <p>{{ bioParagraph1 }}</p>
      <p>{{ bioParagraph2 }}</p>
    </div>
  </header>
</template>
