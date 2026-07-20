# Discord статус

Файл: `server/api/discord.ts`

## Через Lanyard (без своей регистрации)

1. Зайди на сервер с Lanyard (например, [dis.gd](https://discord.gg/lanyard))
2. Открой `server/api/discord.ts`
3. Замени ID:

```ts
const LANYARD_API = `https://api.lanyard.rest/v1/users/ТВОЙ_DISCORD_ID`
```

Узнать свой Discord ID: `Настройки → Расширенные → Режим разработчика` → ПКМ по себе → `Копировать ID`.

## Свой Lanyard

Подними свой экземпляр и замени base URL в `server/api/discord.ts`.
