# Деплой

## Docker (из коробки)

```bash
docker compose up -d
```

Создай `.env`:

```env
DOMAIN=твой-сайт.ru
STEAM_API_KEY=...
STEAM_ID=...
```

Caddy получит SSL автоматически.

## Vercel / Netlify

Подключи репозиторий.  
Команда сборки: `bun run build`  
Папка: `.output/public`

## Любой VPS

```bash
bun run build
bun run .output/server/index.mjs
```

Прокси через nginx/caddy на порт 3000.
