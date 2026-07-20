# nio's site

Личный сайт-визитка. Nuxt 4, Tailwind CSS v4, TypeScript.
Discord + Steam статусы в реальном времени, кастомный курсор, смена темы.

```bash
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
├── app.vue              # Layout (навигация, тема, курсор, статусы)
├── error.vue            # 404
├── composables/         # Логика (тема, Discord, Steam, курсор, навигация)
├── components/          # UI-компоненты (AppBackground, AppFooter)
├── pages/               # 4 страницы (соцсети, проекты, сетап, топ аниме)
├── server/api/          # API-прокси (Discord, Steam)
├── nuxt.config.ts
└── public/
```

## Особенности

- **Страницы**: переключение между 4 табами с кроссфейд-анимацией (`mode="out-in"`)
- **Тема**: тёмная/светлая + акцентный цвет + градиентные пресеты
- **Курсор**: кастомный из 4 уголков, заменяет нативный на десктопах
- **Статусы**: Discord (через Lanyard REST) и Steam в реальном времени
- **Футер**: лицензионная атрибуция (MIT, Niorio — удаление запрещено)

## Лицензия

MIT © Niorio. При использовании обязательно сохранять футер с ссылкой на оригинал.
