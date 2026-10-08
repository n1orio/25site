import type { GithubData, GithubRepoStats } from "~/types/github"
import { projects } from "~/config"

const LOGIN = "n1orio"
const API = "https://api.github.com"
const TTL = 60 * 60 * 1000 // статистика меняется редко — час
/** без токена лимит 60/час, с токеном 5000/час */
const MAX_REPOS = 8

interface RepoNode {
  name: string
  full_name: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  language: string | null
  size: number
  description: string | null
  pushed_at: string | null
  fork: boolean
  archived: boolean
}

interface CommitRef {
  sha?: string
}

interface ReleaseNode {
  assets?: { download_count?: number }[]
  tag_name?: string
}

/** owner/repo из ссылки на github.com в карточке проекта */
const reposFromConfig = () => {
  const out: string[] = []
  for (const p of projects) {
    for (const l of p.links) {
      const m = l.url.match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/|$)/i)
      if (m) {
        const id = `${m[1]}/${m[2]}`
        if (!out.includes(id)) out.push(id)
      }
    }
  }
  return out
}

export default defineEventHandler(async (): Promise<GithubData | null> => {
  return cachedFetch<GithubData | null>("github", TTL, async () => {
    const { githubToken } = useRuntimeConfig()
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "25site",
    }
    if (githubToken) headers.Authorization = `Bearer ${githubToken}`

    try {
      const all = await $fetch<RepoNode[]>(
        `${API}/users/${LOGIN}/repos?per_page=100&sort=pushed`,
        { headers },
      )
      const byName = new Map(all.map((r) => [r.full_name.toLowerCase(), r]))

      // репозитории, которые хотим обогатить (из config.ts)
      const wanted = reposFromConfig().slice(0, MAX_REPOS)

      // недостающие (например, после переименования) ищем по имени
      const resolved = await Promise.all(wanted.map(async (id) => {
        const hit = byName.get(id.toLowerCase())
        if (hit) return hit
        const [owner, name] = id.split("/")
        try {
          return await $fetch<RepoNode>(`${API}/repos/${owner}/${name}`, { headers })
        } catch {
          return undefined
        }
      }))

      const targets = resolved.filter((r): r is RepoNode => Boolean(r))

      const detailed = await Promise.all(targets.map(async (repo): Promise<GithubRepoStats> => {
        const [commits, langs, releases] = await Promise.all([
          // точное число коммитов: берём последнюю страницу из заголовка Link
          $fetch.raw<CommitRef[]>(`${API}/repos/${repo.full_name}/commits?per_page=1`, { headers })
            .then((r) => {
              const link = String(r.headers.get("link") ?? "")
              const last = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
              return last ? Number(last[1]) : null
            })
            .catch(() => null),
          $fetch<Record<string, number>>(`${API}/repos/${repo.full_name}/languages`, { headers })
            .catch(() => ({}) as Record<string, number>),
          $fetch<ReleaseNode[]>(`${API}/repos/${repo.full_name}/releases?per_page=20`, { headers })
            .then((list) => ({
              downloads: (list ?? []).reduce(
                (sum, r) => sum + (r.assets ?? []).reduce((s, a) => s + (a.download_count ?? 0), 0),
                0,
              ),
              latest: list?.[0]?.tag_name ?? null,
            }))
            .catch(() => ({ downloads: 0, latest: null })),
        ])

        const languages = Object.entries(langs ?? {})
          .map(([name, bytes]) => ({ name, bytes }))
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 5)

        return {
          id: repo.full_name,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          watchers: repo.watchers_count ?? 0,
          openIssues: repo.open_issues_count ?? 0,
          language: repo.language,
          sizeKb: repo.size ?? 0,
          description: repo.description,
          commits,
          languages,
          downloads: releases.downloads,
          latestRelease: releases.latest,
          pushedAt: repo.pushed_at ? Math.floor(new Date(repo.pushed_at).getTime() / 1000) : null,
        }
      }))

      const counts = new Map<string, number>()
      for (const r of all) {
        if (r.fork || r.archived) continue
        if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1)
      }

      return {
        login: LOGIN,
        totalRepos: all.filter((r) => !r.fork).length,
        totalStars: all.reduce((s, r) => s + (r.stargazers_count ?? 0), 0),
        totalForks: all.reduce((s, r) => s + (r.forks_count ?? 0), 0),
        topLanguages: [...counts.entries()]
          .map(([name, repos]) => ({ name, repos }))
          .sort((a, b) => b.repos - a.repos)
          .slice(0, 5),
        repos: Object.fromEntries(detailed.map((r) => [r.id.toLowerCase(), r])),
        ok: true,
      }
    } catch {
      return null
    }
  })
})
