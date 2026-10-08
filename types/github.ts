export interface GithubRepoStats {
  /** "owner/repo" */
  id: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  /** основной язык по GitHub */
  language: string | null
  /** размер репозитория в КБ (как отдаёт API) */
  sizeKb: number
  description: string | null
  /** точное число коммитов, посчитанное по заголовку Link */
  commits: number | null
  /** язык -> байты, как отдаёт /languages */
  languages: { name: string; bytes: number }[]
  /** суммарные скачивания всех релизов */
  downloads: number
  /** тег последнего релиза */
  latestRelease: string | null
  /** метка времени последнего пуша (unix, секунды) */
  pushedAt: number | null
}

export interface GithubData {
  login: string
  /** сколько репозиториев всего в аккаунте */
  totalRepos: number
  totalStars: number
  totalForks: number
  /** язык -> число репозиториев */
  topLanguages: { name: string; repos: number }[]
  /** статистика по конкретным репозиториям */
  repos: Record<string, GithubRepoStats>
  /** загрузились ли данные (false = лимит API или сеть) */
  ok: boolean
}
