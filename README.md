# nio's site

Личный сайт-визитка. Nuxt 4, Tailwind CSS v4, TypeScript.  
Discord + Steam статусы в реальном времени, кастомный курсор, смена темы.

```
bun install
bun dev
```

📖 [Вики — как форкнуть и настроить](https://github.com/n1orio/25site/wiki)

## Команды

| Команда | Описание |
|---|---|
| `bun dev` | Dev-сервер `:3000` |
| `bun run build` | Production сборка |
| `bun run preview` | Предпросмотр сборки |
| `bun run typecheck` | TypeScript проверка |
| `bun run lint` | ESLint |

## Структура

```
├── app.vue              # Layout
├── error.vue            # 404
├── composables/         # Логика (тема, Discord, Steam, курсор, навигация)
├── components/          # UI-компоненты (AppBackground)
├── pages/               # Страницы
├── server/api/          # API-прокси (Discord, Steam)
├── nuxt.config.ts
└── public/
```
