# Проекты

Файл: `pages/projects.vue`

Массив `projects`:

```js
{
  title: "Название проекта",
  desc: "Короткое описание",
  tags: ["Vue", "Tailwind"],           // массив тегов
  links: [
    { label: "GitHub", url: "https://..." },
    { label: "Демо", url: "https://..." },
  ],
}
```

`links` может быть пустым или отсутствовать.
