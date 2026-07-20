# Топ аниме

Все данные — в файле `config.ts`, массив `topAnime` + строка `animeDisclaimer`.

```ts
export const topAnime = [
  { title: "Ре: Зеро", desc: "Лучший исекай, который я смотрел." },
  { title: "Магическая битва" },           // desc — необязательно
]

export const animeDisclaimer = "Все аниме в топе хорошие..."
```

Первые три — золото/серебро/бронза (настраивается в `getRankStyle` в `pages/now.vue`).
