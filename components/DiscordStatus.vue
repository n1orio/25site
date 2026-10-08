<script setup lang="ts">
defineProps<{
  discordStatusColor: string
  discordStatus: string
  visibleActivities: any[]
  getActivityTypeLabel: (a: any) => string
  getActivityTitle: (a: any) => string
  getActivitySublines: (a: any) => string[]
  getActivityIcon: (type: number) => string
  getDiscordAssetUrl: (appId: string | undefined, image: string | null | undefined) => string | undefined
}>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="mdi:discord" size="16" class="w-4 h-4" style="color: var(--accent-contrast)" />
        <p class="ds-meta">Discord</p>
      </div>
      <span class="ds-pill !py-0.5 !px-2">
        <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: discordStatusColor }" />
        {{ discordStatus === "offline" ? "оффлайн" : "в сети" }}
      </span>
    </div>

    <div v-if="visibleActivities.length > 0" class="flex flex-col gap-3">
      <div
        v-for="activity in visibleActivities"
        :key="activity.id || activity.name"
        class="flex items-center gap-3 p-3"
        style="background: color-mix(in srgb, var(--accent-contrast) 14%, transparent); border-radius: var(--radius-pill)"
      >
        <div class="relative flex-shrink-0">
          <template v-if="activity.assets?.large_image">
            <img
              :src="getDiscordAssetUrl(activity.application_id, activity.assets.large_image)"
              class="w-10 h-10 object-cover flex-shrink-0"
              :style="{ borderRadius: activity.type === 2 && activity.name === 'Spotify' ? '9999px' : 'var(--radius-card)' }"
            />
          </template>
          <template v-else>
            <div class="w-10 h-10 flex items-center justify-center" style="color: var(--text-secondary)">
              <Icon :name="getActivityIcon(activity.type)" size="20" class="w-5 h-5" />
            </div>
          </template>

          <img
            v-if="activity.assets?.small_image"
            :src="getDiscordAssetUrl(activity.application_id, activity.assets.small_image)"
            class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full object-cover border-2"
            style="border-color: var(--accent-surface)" />
        </div>

        <div class="min-w-0 flex flex-col justify-center">
          <p class="ds-meta mb-0.5">{{ getActivityTypeLabel(activity) }}</p>
          <p class="ds-title text-sm truncate">{{ getActivityTitle(activity) }}</p>
          <p v-for="(line, idx) in getActivitySublines(activity)" :key="idx" class="ds-body text-xs truncate">{{ line }}</p>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center gap-3 p-3"
      style="background: color-mix(in srgb, var(--accent-contrast) 14%, transparent); border-radius: var(--radius-pill)">
      <div class="w-10 h-10 flex items-center justify-center flex-shrink-0" style="color: var(--text-secondary)">
        <Icon name="lucide:moon" size="20" class="w-5 h-5" />
      </div>
      <div class="min-w-0">
        <p class="ds-meta mb-0.5">Статус</p>
        <p class="ds-title text-sm truncate">Нет активности</p>
        <p class="ds-body text-xs">Оффлайн</p>
      </div>
    </div>
  </div>
</template>
