# Steam статус

Файл: `server/api/steam.ts`

Нужен API-ключ Steam: https://steamcommunity.com/dev/apikey

Создай `.env` в корне:

```env
NUXT_STEAM_API_KEY=твой_ключ
NUXT_STEAM_ID=76561198...
```

Префикс `NUXT_` обязателен: без него ключ запекается в образ при сборке и
изменения в `.env` не подхватываются без пересборки контейнера.

**Как узнать Steam ID**: открой профиль в браузере — если в адресной строке
только цифры, это он. Если там имя, используй https://steamid.io.

## Что делает эндпоинт

Четыре запроса к Steam параллельно, ответ кэшируется на 2 минуты:

| Запрос | Что берёт |
|---|---|
| `GetPlayerSummaries` | персона, аватар, состояние, текущая игра |
| `GetSteamLevel` | уровень аккаунта |
| `GetRecentlyPlayedGames` | последние игры и часы за 2 недели |
| `GetOwnedGames` | всего игр в библиотеке |

## Как понять, что ключ сломался

Эндпоинт молча откатывается на заглушку. Признак — в сайдбаре видно
«Неизвестно» и «0 ч. за 2 недели» вместо нормальных данных.

Проверка напрямую:

```bash
curl -s "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$KEY&steamids=$ID"
```

HTTP 403 и «Please verify your key= parameter» — ключ невалиден или отозван.
HTTP 200 и JSON с `personaname` — всё в порядке.
