# Топ аниме

Все данные — в файле `config.ts`, массив `topAnime` + строка `animeDisclaimer`.

```ts
const medal = ["#f59e0b", "#a1a1aa", "#d97706"]  // золото, серебро, бронза

export const topAnime = [
  { title: "Ре: Зеро", desc: "Лучший исекай, который я смотрел." },
  { title: "Магическая битва" },           // desc — необязательно
]

export const animeDisclaimer = "Все аниме в топе хорошие..."
```

Первые три места подсвечиваются цветами медали — массив `medal` в начале `pages/now.vue`:
