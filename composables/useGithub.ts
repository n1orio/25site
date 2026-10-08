import type { GithubData, GithubRepoStats } from "~/types/github"

/** "owner/repo" из ссылки на github.com */
export const githubRepoId = (url: string) => {
  const m = url.match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/|$)/i)
  return m ? `${m[1]}/${m[2]}` : null
}

export const useGithub = (data: Ref<GithubData | null | undefined>) => {
  const info = computed(() => data.value ?? null)

  /** статистика по проекту: ищем по точному id, затем по имени репозитория */
  const statsFor = (links: { url: string }[]): GithubRepoStats | null => {
    const repos = info.value?.repos
    if (!repos) return null
    for (const l of links) {
      const id = githubRepoId(l.url)
      if (!id) continue
      const exact = repos[id.toLowerCase()]
      if (exact) return exact
      // репозиторий мог быть переименован — ищем по имени после слэша
      const name = id.split("/")[1]?.toLowerCase()
      const hit = Object.values(repos).find((r) => r.id.split("/")[1]?.toLowerCase() === name)
      if (hit) return hit
    }
    return null
  }

  const daysAgo = (unix: number | null) => {
    if (!unix) return null
    const days = Math.floor((Date.now() - unix * 1000) / 86_400_000)
    if (days <= 0) return "сегодня"
    if (days === 1) return "вчера"
    if (days < 30) return `${days} дн. назад`
    if (days < 365) return `${Math.floor(days / 30)} мес. назад`
    return `${Math.floor(days / 365)} г. назад`
  }

  const sizeLabel = (kb: number) =>
    kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${kb} КБ`

  const compact = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

  return { info, statsFor, daysAgo, sizeLabel, compact }
}
