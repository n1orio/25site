# Деплой

## Переменные окружения

Все ключи читаются с префиксом `NUXT_`. Без префикса значение запекается в
образ при сборке Docker и не обновляется без пересборки — на этом уже
заваливался Steam-ключ.

```env
DOMAIN=твой-сайт.ru

NUXT_STEAM_API_KEY=...
NUXT_STEAM_ID=76561198...

NUXT_GITHUB_TOKEN=github_pat_...
```

Полный шаблон — в `.env.example`.

## Docker Compose

```bash
docker compose up -d --build site
```

Три сервиса: `site` (Nuxt), `multi-scrobbler`, `caddy`. Caddy сам берёт
SSL-сертификат через ACME.

## Ключевой момент: Caddy не сжимает ответы по умолчанию

Без директива `encode` Caddy отдаёт всё распакованным. На старой версии сайта
это означало 335 КБ на первую загрузку вместо 121 КБ:

| | без `encode` | с `encode` |
|---|---|---|
| JS | 264 КБ | 102 КБ |
| CSS | 32 КБ | 7.8 КБ |
| HTML | 39 КБ | 10.5 КБ |

Текущий `Caddyfile`:

```caddy
{$DOMAIN} {
    encode gzip zstd

    reverse_proxy site:3000

    @immutable path /_nuxt/*
    header @immutable Cache-Control "public, max-age=31536000, immutable"
}
```

## ⚠️ Ловушка: кастомный блок в Caddyfile

На сервере в `Caddyfile` может быть добавлен блок проксирования WebSocket
(например, для xray), которого нет в репозитории. **`git reset --hard` его
уничтожит.**

Если такой блок есть — сохрани перед обновлением и верни после:

```bash
cp Caddyfile /root/Caddyfile.backup
git fetch origin && git reset --hard origin/main
cp /root/Caddyfile.backup Caddyfile
docker compose restart caddy
```

## Обновление на сервере

```bash
cd /opt/25site
git fetch origin
git reset --hard origin/main     # см. предупреждение выше про Caddyfile
docker compose build site
docker compose up -d site
```

Правка только `.env` пересборки не требует:

```bash
docker compose restart site
```

## Проверка после деплоя

```bash
curl -sI https://твой-сайт.ru | head -5          # 200 и content-encoding: gzip
docker compose ps                                # все сервисы Up
docker compose logs site --tail 20
```

## Vercel / Netlify

Команда сборки: `bun run build`, папка `.output/public`.

## Любой VPS без Docker

```bash
bun run build
bun run .output/server/index.mjs
```

Проксируй через nginx или caddy на порт 3000 — и не забудь `encode`.
