<script setup lang="ts">
import type { GithubData } from "~/types/github"
import type { ContributionsData } from "~/server/api/contributions"
import type { ModrinthData } from "~/server/api/modrinth"
import { projects } from "~/config"

const { data: gh } = await useFetch<GithubData | null>("/api/github")
const { data: contrib } = await useFetch<ContributionsData | null>("/api/contributions")
const { info, statsFor, daysAgo, sizeLabel, compact } = useGithub(gh)

const { data: mr } = await useFetch<ModrinthData | null>("/api/modrinth")

/** slug проекта из ссылки на modrinth.com в карточке */
const modrinthSlug = (links: { url: string }[]) => {
  for (const l of links) {
    const m = l.url.match(/modrinth\.com\/(?:mod|modpack|plugin|resourcepack|datapack|project|shader)\/([\w-]+)/i)
    if (m) return m[1]!.toLowerCase()
  }
  return null
}

/** активные проекты и архив */
const active = computed(() => projects.filter((p) => !p.archived))
const archived = computed(() => projects.filter((p) => p.archived))

/** карточка + её статистика, считается один раз (в архиве GitHub не нужен) */
const rows = computed(() =>
  active.value.map((project) => {
    const slug = modrinthSlug(project.links)
    return {
      project,
      gh: statsFor(project.links),
      mr: slug ? mr.value?.projects?.[slug] ?? null : null,
    }
  }),
)

/** доли языков для полоски, в процентах от суммы */
const langShare = (langs: { name: string; bytes: number }[], bytes: number) =>
  (bytes / langs.reduce((s, l) => s + l.bytes, 0)) * 100

const summary = computed(() => {
  const d = info.value
  if (!d?.ok) return null
  return [
    { label: "репозиториев", value: d.totalRepos },
    { label: "звёзд", value: d.totalStars },
    { label: "языков", value: d.topLanguages.length },
  ]
})
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Мои работы</h2>
      <WaveDivider class="flex-1" />
    </header>

    <!-- сводка по аккаунту -->
    <div v-if="summary" class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
      <span v-for="s in summary" :key="s.label" class="ds-pill">
        <span class="ds-stat text-sm">{{ s.value }}</span>
        <span class="ds-meta">{{ s.label }}</span>
      </span>
      <span v-if="info?.topLanguages.length" class="ds-meta">
        {{ info.topLanguages.map((l) => l.name).join(" · ") }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="{ project, gh, mr } in rows"
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
        <p class="ds-body text-sm mb-4">{{ project.desc }}</p>

        <!-- статистика с GitHub -->
        <div v-if="gh" class="mb-4">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2.5">
            <span class="ds-meta flex items-center gap-1">
              <Icon name="mdi:star" size="12" class="w-3 h-3" />
              {{ gh.stars }}
            </span>
            <span v-if="gh.commits" class="ds-meta flex items-center gap-1">
              <Icon name="lucide:git-commit-horizontal" size="12" class="w-3 h-3" />
              {{ gh.commits }} коммитов
            </span>
            <span v-if="gh.downloads" class="ds-meta flex items-center gap-1">
              <Icon name="lucide:download" size="12" class="w-3 h-3" />
              {{ compact(gh.downloads) }}
            </span>
            <span class="ds-meta ml-auto">{{ daysAgo(gh.pushedAt) ?? '—' }}</span>
          </div>

          <!-- состав по языкам -->
          <div v-if="gh.languages.length" class="flex h-1.5 rounded-full overflow-hidden">
            <span
              v-for="(lang, i) in gh.languages"
              :key="lang.name"
              class="h-full"
              :style="{
                width: `${langShare(gh.languages, lang.bytes)}%`,
                opacity: 1 - i * 0.18,
                background: 'var(--accent-contrast)',
              }"
              :title="`${lang.name} — ${sizeLabel(Math.round(lang.bytes / 1024))}`"
            />
          </div>
          <p v-if="gh.languages.length" class="ds-meta mt-1.5">
            {{ gh.languages.map((l) => l.name).join(" · ") }}
          </p>
        </div>

        <!-- статистика с Modrinth -->
        <div v-if="mr" class="mb-4">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="ds-meta flex items-center gap-1">
              <Icon name="lucide:download" size="12" class="w-3 h-3" />
              {{ compact(mr.downloads) }} скачиваний
            </span>
            <span v-if="mr.followers" class="ds-meta flex items-center gap-1">
              <Icon name="lucide:heart" size="12" class="w-3 h-3" />
              {{ mr.followers }}
            </span>
            <span v-if="mr.license" class="ds-meta ml-auto">{{ mr.license }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-auto">
          <span v-for="tag in project.tags" :key="tag" class="ds-pill">{{ tag }}</span>
        </div>
      </article>
    </div>

    <!-- календарь вкладов -->
    <div v-if="contrib" class="mt-10">
      <ContributionGraph :data="contrib" />
    </div>

    <!-- архив -->
    <section v-if="archived.length" class="mt-10">
      <header class="flex items-center gap-3 mb-4">
        <h2 class="on-bg-meta">Архив</h2>
        <WaveDivider class="flex-1" />
      </header>

      <div class="flex flex-col">
        <div
          v-for="project in archived"
          :key="project.title"
          class="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 border-b last:border-0"
          style="border-color: var(--border-subtle)"
        >
          <Icon :name="project.icon" size="16" class="w-4 h-4 self-center flex-shrink-0"
            style="color: var(--accent-on-bg)" />
          <h3 class="ds-title text-sm" style="color: var(--text-primary)">{{ project.title }}</h3>
          <p class="on-bg-body text-xs truncate max-w-[46ch] hidden sm:block">{{ project.desc }}</p>
          <div class="flex flex-wrap gap-2 ml-auto">
            <span v-for="tag in project.tags" :key="tag" class="on-bg-meta">{{ tag }}</span>
          </div>
          <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank" rel="noopener"
            class="ds-action flex-shrink-0" :aria-label="link.label">
            <Icon :name="link.icon" size="14" class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  </section>
</template>
