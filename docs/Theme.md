# Цвета и тема

Файл: `composables/useSecretTheme.ts`

## Акцентный цвет

```ts
const accentColor = useLocalStorage("nio-accent-color", "#6366f1");
//                                                         ↑ замени на свой
```

## Градиенты-пресеты

```ts
const gradientPresets = [
  { id: "ruby",  name: "Рубин",  colors: ["#E74C3C", "#C0392B"] },
  { id: "gold",  name: "Золото", colors: ["#FFD93D", "#B8860B"] },
  // Добавь свои или удали ненужные
];
```

## Тёмная/светлая тема

Используется `useDark()` из VueUse. Автоматически подхватывает системные настройки. Кнопка переключения — луна/солнце в навигации.
