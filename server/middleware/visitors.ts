import { createHash } from "node:crypto"

const STORAGE_KEY = "visitors:seen"
const PRUNE_KEY = "visitors:pruned"
/** записи старше этого срока вычищаются, чтобы карта не росла бесконечно */
const KEEP_DAYS = 180
/** повторный визит в течение этого окна не трогает хранилище вовсе */
const TOUCH_WINDOW = 30 * 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/** считаем только HTML-страницы: ассеты и API должны быть бесплатными */
const isPageRequest = (path: string, method?: string) => {
  if (method && method !== "GET" && method !== "HEAD") return false
  if (path.startsWith("/api/") || path.startsWith("/_nuxt/")) return false
  if (/\.(ico|png|jpg|jpeg|webp|gif|svg|woff2?|css|js|map|txt|xml|json)$/i.test(path)) return false
  return true
}

export default defineEventHandler(async (event) => {
  if (import.meta.dev) return

  const path = event.path.split("?")[0]!
  if (!isPageRequest(path, event.method)) return

  // за обратным прокси реального клиента может не быть — считаем всех подряд
  const ip = getRequestIP(event, { xForwardedFor: true }) || "local"
  const ua = getRequestHeader(event, "user-agent") || ""
  const lang = getRequestHeader(event, "accept-language") || ""

  // наружу отдаётся только хеш: сырые адреса не копятся в хранилище
  const hash = createHash("sha256")
    .update(`${ip}|${ua}|${lang}`)
    .digest("hex")
    .slice(0, 16)

  const now = Date.now()
  const storage = useStorage("data")

  try {
    const raw = await storage.getItem<Record<string, number>>(STORAGE_KEY)
    const seen: Record<string, number> = raw ?? {}

    const lastSeen = seen[hash]
    if (typeof lastSeen === "number" && now - lastSeen < TOUCH_WINDOW) return

    seen[hash] = now

    // чистим не чаще раза в час, маркер храним отдельно от самих посетителей
    const lastPrune = (await storage.getItem<number>(PRUNE_KEY)) ?? 0
    if (now - lastPrune > HOUR) {
      await storage.setItem(PRUNE_KEY, now)
      for (const [key, ts] of Object.entries(seen)) {
        if (typeof ts === "number" && now - ts > KEEP_DAYS * DAY) delete seen[key]
      }
    }

    await storage.setItem(STORAGE_KEY, seen)
  } catch {
    // хранилище недоступно — молча работаем без счётчика
  }
})
