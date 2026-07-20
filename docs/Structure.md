# Структура

```
├── app.vue                 # Главный layout (навигация, тема, курсор, статусы)
├── error.vue               # 404 страница
├── pages/
│   ├── index.vue           # Соцсети
│   ├── projects.vue        # Проекты
│   ├── uses.vue            # Сетап
│   └── now.vue             # Топ аниме
├── composables/
│   ├── useSecretTheme.ts   # Тема, цвета, градиенты
│   ├── useDiscord.ts       # Discord активности
│   ├── useSteam.ts         # Steam статус
│   ├── useCursor.ts        # Кастомный курсор
│   └── useNavigation.ts    # Навигация (табы, свайп, скролл, индикатор)
├── components/
│   ├── AppBackground.vue   # Фон (blur-слои)
│   └── AppFooter.vue       # Футер (атрибуция, лицензия)
├── server/api/
│   ├── discord.ts          # Lanyard REST
│   └── steam.ts            # Steam Web API
├── assets/css/main.css     # Tailwind + шрифты
├── nuxt.config.ts
├── docker-compose.yml
├── Dockerfile
└── public/favicon.ico
```

Если что-то не нужно — удали файл и убери импорт из `app.vue`.
