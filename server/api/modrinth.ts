import { projects } from "~/config"

export interface ModrinthProject {
  slug: string
  title: string
  downloads: number
  followers: number
  /** количество поддерживаемых версий игры */
  gameVersions: number
  loaders: string[]
  license: string | null
  updated: string | null
}

export interface ModrinthData {
  projects: Record<string, ModrinthProject>
}

interface ModrinthNode {
  slug: string
  title: string
  downloads: number
  followers: number
  game_versions?: string[]
  loaders?: string[]
  license?: { id: string } | null
  updated?: string
}

/** slug из ссылки вида https://modrinth.com/mod/tfmg-energy-converter */
const slugsFromConfig = () => {
  const out: string[] = []
  for (const p of projects) {
    for (const l of p.links) {
      const m = l.url.match(/modrinth\.com\/(?:mod|modpack|plugin|resourcepack|datapack|project|shader)\/([\w-]+)/i)
      if (m && !out.includes(m[1]!)) out.push(m[1]!)
    }
  }
  return out
}

export default defineEventHandler(async (): Promise<ModrinthData | null> => {
  return cachedFetch<ModrinthData | null>("modrinth", 60 * 60 * 1000, async () => {
    const slugs = slugsFromConfig()
    if (!slugs.length) return { projects: {} }

    try {
      const nodes = await Promise.all(
        slugs.map((slug) =>
          $fetch<ModrinthNode>(`https://api.modrinth.com/v2/project/${slug}`)
            .catch(() => null),
        ),
      )

      const list = nodes.filter((n): n is ModrinthNode => Boolean(n))
      return {
        projects: Object.fromEntries(list.map((n) => [
          n.slug,
          {
            slug: n.slug,
            title: n.title,
            downloads: n.downloads ?? 0,
            followers: n.followers ?? 0,
            gameVersions: n.game_versions?.length ?? 0,
            loaders: n.loaders ?? [],
            license: n.license?.id ?? null,
            updated: n.updated?.slice(0, 10) ?? null,
          },
        ])),
      }
    } catch {
      return null
    }
  })
})
