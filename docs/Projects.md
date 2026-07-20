# Проекты

Все данные — в файле `config.ts`, массив `projects`.

```ts
{
  icon: "lucide:bot",                      // иконка
  title: "Название проекта",               // название
  desc: "Короткое описание",               // описание
  tags: ["Vue", "Tailwind"],               // массив тегов
  noHover: false,                          // отключить ховер-подъём (необязательно)
  links: [                                // ссылки (может быть пустым)
    { label: "GitHub", icon: "mdi:github", url: "https://..." },
  ],
}
```
