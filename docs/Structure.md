# Структура

```
├── app.vue                 # Главный layout
├── error.vue               # 404 страница
├── pages/
│   ├── index.vue           # Соцсети
│   ├── projects.vue        # Проекты
│   ├── uses.vue            # Сетап
│   └── now.vue             # Топ аниме
├── composables/
│   ├── useSecretTheme.ts   # Тема, цвета
│   ├── useDiscord.ts       # Discord активности
│   ├── useSteam.ts         # Steam статус
│   ├── useCursor.ts        # Кастомный курсор
│   └── useNavigation.ts    # Навигация
├── components/
│   └── AppBackground.vue   # Фон
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
