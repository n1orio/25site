# Структура

```
├── config.ts                 # ВСЁ содержимое сайта (био, соцсети, проекты, сетап, аниме, навигация)
├── app.vue                   # Layout: фетч данных, композаблы, сетка, стили дизайн-системы
├── error.vue                 # 404
├── nuxt.config.ts            # Конфиг, runtimeConfig (NUXT_*), preload шрифтов
│
├── pages/
│   ├── index.vue             # Соцсети
│   ├── projects.vue          # Проекты + архив + календарь вкладов
│   ├── uses.vue              # Сетап
│   ├── deadlock.vue          # Deadlock: ранг, ранкед, герои, предметы
│   └── now.vue               # Топ аниме
│
├── components/
│   ├── ProfileCard.vue       # Аватар, статус, био
│   ├── DiscordStatus.vue     # Активности Discord
│   ├── SteamStatus.vue       # Статус Steam
│   ├── DeadlockStats.vue     # Все блоки статистики Deadlock
│   ├── ContributionGraph.vue # Календарь вкладов (кликабельные плитки)
│   ├── LocalStatus.vue       # Локальное время + погода
│   ├── Navigation.vue        # Табы, переключатель темы, палитра
│   ├── WaveDivider.vue       # Волна-разделитель секций
│   ├── AppBackground.vue     # Фон (blur-слои)
│   └── AppFooter.vue         # Футер (атрибуция, лицензия)
│
├── composables/
│   ├── useSecretTheme.ts     # Тема, акцент, градиенты, расчёт --accent-*
│   ├── useThemeCircle.ts     # Круговое переключение темы
│   ├── useCursor.ts          # Кастомный курсор (цвет по поверхности)
│   ├── useNavigation.ts      # Навигация (табы, свайп, скролл)
│   ├── useDiscord.ts         # Разбор активностей Discord
│   ├── useSteam.ts           # Форматирование Steam
│   ├── useDeadlock.ts        # Форматирование Deadlock + подписи режимов
│   ├── useGithub.ts          # Поиск репозитория и форматирование
│   └── useCopy.ts            # Копирование в буфер с обратной связью
│
├── server/
│   ├── api/
│   │   ├── discord.ts        # Lanyard REST
│   │   ├── steam.ts          # Steam Web API (4 запроса)
│   │   ├── deadlock.ts       # ddlk.bio: ранг, матчи, статистика, предметы
│   │   ├── github.ts         # GitHub: репозитории, коммиты, языки, релизы
│   │   ├── contributions.ts  # Календарь вкладов (парсинг HTML GitHub)
│   │   ├── modrinth.ts       # Modrinth: скачивания и фоллверы
│   │   └── weather.ts        # Open-Meteo, без ключа
│   └── utils/
│       └── cache.ts          # cachedFetch<T>(key, ttl, fetcher)
│
├── types/
│   ├── deadlock.ts           # Типы данных Deadlock
│   └── github.ts             # Типы статистики GitHub
│
├── assets/css/main.css       # Tailwind, шрифты, дизайн-токены
├── public/fonts/             # Inter (переменный) и Monaspace Argon, самохостинг
├── public/favicon.ico        # Аватарка Discord (favicon + apple-touch-icon)
├── public/og.png             # Превью для ссылок в мессенджерах, 1200x630
├── public/robots.txt
├── Dockerfile                # oven/bun, два этапа
├── docker-compose.yml        # site + multi-scrobbler + caddy
├── Caddyfile                 # reverse_proxy, encode, кеш статики
└── .github/workflows/ci.yml  # lint + typecheck
```

## Поток данных

Всё живёт на сервере (SSR). Страница делает `await useFetch("/api/...")`, эндпоинт
сходит во внешний API, оборачивает в `cachedFetch` — повторные запросы из
браузера и рендер не ходят наружу. Подробности в [API и кэш](Api).
