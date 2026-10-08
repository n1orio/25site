import { computed } from "vue";
import type { Ref } from "vue";
import { useLocalStorage, useDark } from "@vueuse/core";

// HEX в HSL
const hexToHsl = (hex: string) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return [0, 0, 0];
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

// HSL в HEX
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Тема «Дедлок» — не просто цвета, а отдельный слой оформления
 * (assets/css/deadlock.css, включается атрибутом data-deadlock).
 * Оформление и палитра скопированы с /home/nio/mistraly-site.
 *
 * Палитра задаётся здесь, потому что --accent* приходят в разметку
 * инлайном: инлайн бьёт любой селектор, перебить его из CSS нельзя.
 */
const DEADLOCK = {
  presetId: "deadlock",
  name: "Дедлок",
  /** пара цветов в палитре: по ней же включается слой оформления */
  colors: ["#DD6638", "#8C4520"],
  bg: "#0C0C0C",
  bgDeep: "#070707",
  bgLight: "#EFECE1",
  /** карточки красит CSS градиентом, это запасной цвет */
  card: "#292820",
  cardLight: "#FFFDF6",
  text: "#FFFFFF",
  textLight: "#141310",
  accent: "#DD6638",
  /** второй цвет градиента — затемнённый тон акцента */
  accentAlt: "#8C4520",
} as const;

/** шрифты темы грузятся отдельно, см. useDeadlockFonts */

// Управление темой
export const useSecretTheme = () => {
  // useDark: prefers-color-scheme + .dark на &lt;html&gt;
  const isDark = useDark();
  // Пресеты градиентов
  const gradientPresets = [
    { id: "ruby",  name: "Рубин",  colors: ["#e53935", "#e35d5b"] },
    { id: "sunset",name: "Закат",  colors: ["#f46b45", "#eea849"] },
    { id: "forest",name: "Лес",    colors: ["#2ECC71", "#145A32"] },
    { id: "teal",  name: "Бирюза", colors: ["#00D2D3", "#006266"] },
    { id: "ocean", name: "Океан",  colors: ["#3498DB", "#1A5276"] },
    { id: "violet",name: "Фиолет", colors: ["#A855F7", "#4C1D95"] },
    { id: "rose",  name: "Роза",   colors: ["#FF6B9D", "#C44569"] },
    { id: "slate", name: "Графит", colors: ["#636E72", "#2D3436"] },
    { id: DEADLOCK.presetId, name: DEADLOCK.name, colors: [...DEADLOCK.colors] },
  ];

  /** тема по умолчанию для новых посетителей */
  const DEFAULT_PRESET = "ocean";
  const defaultColors = () => [
    ...(gradientPresets.find((p) => p.id === DEFAULT_PRESET)?.colors ?? ["#6366f1"]),
  ];

  // Режим: single / gradient
  const themeMode = useLocalStorage("nio-theme-mode", "gradient");
  // Цвет для single-режима — на случай, если переключат вручную
  const accentColor = useLocalStorage("nio-accent-color", defaultColors()[0]!);
  // Цвета для gradient-режима
  const activeGradient = useLocalStorage("nio-active-gradient", defaultColors());

  /**
   * Значения из localStorage на клиенте не подхватывались: refs
   * оставались с SSR-значением (дефолт), поэтому после перезагрузки
   * тема слетала на «Океан» — и слой оформления Deadlock пропадал.
   * Синхронизируем один раз, до первого рендера на клиенте.
   */
  if (import.meta.client) {
    const stored: [Ref<unknown>, string][] = [
      [themeMode, "nio-theme-mode"],
      [accentColor, "nio-accent-color"],
      [activeGradient, "nio-active-gradient"],
    ];
    for (const [ref, key] of stored) {
      const raw = localStorage.getItem(key);
      if (raw == null) continue;
      try { ref.value = JSON.parse(raw) as never } catch { /* мусор в хранилище — оставляем дефолт */ }
    }
  }

  /**
   * Включён ли слой оформления Deadlock. Сверяем с эталонными цветами
   * пресета, а не по id: в localStorage лежит только пара цветов,
   * id живёт лишь в gradientPresets.
   */
  const isDeadlock = computed(
    () =>
      themeMode.value === "gradient" &&
      activeGradient.value[0] === DEADLOCK.colors[0] &&
      activeGradient.value[1] === DEADLOCK.colors[1],
  );

  // Палитра: два цвета фона + два акцента
  const activePalette = computed(() => {
    if (isDeadlock.value) {
      // фон и акценты Deadlock задаёт слой оформления, а не пресет
      return {
        bg1: DEADLOCK.bg, bg2: DEADLOCK.bgDeep,
        accent1: DEADLOCK.accent, accent2: DEADLOCK.accentAlt,
      };
    }
    if (themeMode.value === "gradient") {
      // Из activeGradient
      return {
        bg1: activeGradient.value[0], bg2: activeGradient.value[1],
        accent1: activeGradient.value[0], accent2: activeGradient.value[1],
      };
    } else {
      // Генерируем второй цвет сдвигом на 45°
      const base = accentColor.value || "#6366f1";
      const [h = 0, s = 0, l = 0] = hexToHsl(base);
      const generatedSecondary = hslToHex((h + 45) % 360, s, l);
      return {
        bg1: base, bg2: generatedSecondary,
        accent1: base, accent2: generatedSecondary,
      };
    }
  });

  // Computed для шаблона
  const bgPrimary = computed(() => activePalette.value.bg1);
  const bgSecondary = computed(() => activePalette.value.bg2);
  const primaryColor = computed(() => activePalette.value.accent1);
  const secondaryColor = computed(() => activePalette.value.accent2);

  const setSingleColor = (color: string) => {
    themeMode.value = "single";
    accentColor.value = color;
  };

  const setGradient = (colors: string[]) => {
    themeMode.value = "gradient";
    activeGradient.value = colors;
  };

  // --- контраст и читаемая поверхность для акцента ---
  const hexToRgb = (hex: string): [number, number, number] | null => {
    let h = (hex || "").trim().replace("#", "")
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
    const n = Number.parseInt(h, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const toHex = (rgb: [number, number, number]) =>
    "#" + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
  const luminance = (rgb: [number, number, number]) => {
    const f = (c: number) => {
      const s = c / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
  }
  const contrast = (a: [number, number, number], b: [number, number, number]) => {
    const la = luminance(a); const lb = luminance(b)
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  }

  const LIGHT: [number, number, number] = [250, 250, 250]
  const DARK: [number, number, number] = [12, 12, 16]
  /** Минимальный контраст текста на акцентной заливке */
  const MIN_CR = 5.0

  /**
   * Полярность текста задаёт тема, а не светлота акцента:
   * тёмная тема -> всегда светлый текст, светлая -> всегда тёмный.
   * Акцентная поверхность подтягивается к нужной полярности,
   * сохраняя оттенок, пока текст не достигнет MIN_CR.
   */
  const accentPair = computed(() => {
    // У Deadlock своя поверхность: карточка #292820 с белым текстом в
    // тёмной теме и почти белая — со светлым в светлой. Контраст задан
    // вручную: он заведомо выше любого порога.
    if (isDeadlock.value) {
      return isDark.value
        ? { surface: DEADLOCK.card, contrast: DEADLOCK.text }
        : { surface: DEADLOCK.cardLight, contrast: DEADLOCK.textLight };
    }

    const base = hexToRgb(primaryColor.value || "") ?? hexToRgb("#6366f1")!
    const fg = isDark.value ? LIGHT : DARK
    let surface = base

    if (isDark.value) {
      // светлый текст на тёмной поверхности — уходим в тень
      for (let i = 0; i < 30 && contrast(surface, fg) < MIN_CR; i++) {
        surface = surface.map((c) => c * 0.94) as [number, number, number]
      }
    } else {
      // тёмный текст на светлой поверхности — уходим в свет
      for (let i = 0; i < 30 && contrast(surface, fg) < MIN_CR; i++) {
        surface = surface.map((c) => c + (255 - c) * 0.06) as [number, number, number]
      }
    }

    return { surface: toHex(surface), contrast: toHex(fg) }
  })

  /** Акцент, читаемый на фоне страницы (ссылки футера, номер ошибки) */
  const accentOnBg = computed(() => {
    const base = hexToRgb(primaryColor.value || "") ?? hexToRgb("#6366f1")!;
    // фон Deadlock красит CSS, здесь нужен только для расчёта контраста
    const bg = isDeadlock.value
      ? hexToRgb(isDark.value ? DEADLOCK.bg : DEADLOCK.bgLight)!
      : hexToRgb(bgPrimary.value || "") ?? (isDark.value ? [16, 16, 20] : [244, 244, 245]) as [number, number, number];
    let c = base

    if (isDark.value) {
      for (let i = 0; i < 30 && contrast(c, bg) < 4.5; i++) {
        c = c.map((v) => v + (255 - v) * 0.06) as [number, number, number]
      }
    } else {
      for (let i = 0; i < 30 && contrast(c, bg) < 4.5; i++) {
        c = c.map((v) => v * 0.94) as [number, number, number]
      }
    }
    return toHex(c)
  })

  const accentSurface = computed(() => accentPair.value.surface)
  const accentContrast = computed(() => accentPair.value.contrast)

  return {
    isDark, themeMode, activeGradient, accentColor, gradientPresets,
    isDeadlock,
    bgPrimary, bgSecondary, primaryColor, secondaryColor,
    accentSurface, accentContrast, accentOnBg,
    setSingleColor, setGradient,
  };
};
