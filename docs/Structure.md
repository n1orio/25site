# Структура

```
├── config.ts                 # ВСЁ содержимое сайта (био, соцсети, проекты, сетап, топ аниме, навигация)
├── app.vue                   # Главный layout (оркестрация: фетч, композаблы, сетка компонентов)
├── error.vue                 # 404 страница
├── pages/
│   ├── index.vue             # Соцсети
│   ├── projects.vue          # Проекты
│   ├── uses.vue              # Сетап
│   └── now.vue               # Топ аниме
├── composables/
│   ├── useSecretTheme.ts     # Тема, цвета, градиенты
│   ├── useDiscord.ts         # Discord активности
│   ├── useSteam.ts           # Steam статус
│   ├── useCursor.ts          # Кастомный курсор
│   └── useNavigation.ts      # Навигация (табы, свайп, скролл, индикатор)
├── components/
│   ├── ProfileCard.vue       # Аватар, статус, био
│   ├── DiscordStatus.vue     # Активности Discord
│   ├── SteamStatus.vue       # Статус Steam
│   ├── Navigation.vue        # Табы, тёмная тема, палитра цветов
│   ├── AppBackground.vue     # Фон (blur-слои)
│   └── AppFooter.vue         # Футер (атрибуция, лицензия)
├── server/api/
│   ├── discord.ts            # Lanyard REST
│   └── steam.ts              # Steam Web API
├── assets/css/main.css       # Tailwind + шрифты
├── nuxt.config.ts
├── docker-compose.yml
├── Dockerfile
└── public/favicon.ico
```

**Чтобы изменить любой текст на сайте** — открой `config.ts` и правь нужную секцию.

Если какой-то компонент не нужен — удали файл и убери его из `app.vue`.
