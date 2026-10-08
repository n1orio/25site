import { computed } from "vue";
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

// Управление темой
export const useSecretTheme = () => {
  // useDark: prefers-color-scheme + .dark на &lt;html&gt;
  const isDark = useDark();
  // Режим: single / gradient
  const themeMode = useLocalStorage("nio-theme-mode", "single");
  // Цвет для single-режима
  const accentColor = useLocalStorage("nio-accent-color", "#6366f1");
  // Цвета для gradient-режима
  const activeGradient = useLocalStorage("nio-active-gradient", ["#E94057", "#8A2387"]);

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
  ];

  // Палитра: два цвета фона + два акцента
  const activePalette = computed(() => {
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
    const base = hexToRgb(primaryColor.value || "") ?? hexToRgb("#6366f1")!
    const bg = hexToRgb(bgPrimary.value || "") ?? (isDark.value ? [16, 16, 20] : [244, 244, 245]) as [number, number, number]
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
    bgPrimary, bgSecondary, primaryColor, secondaryColor,
    accentSurface, accentContrast, accentOnBg,
    setSingleColor, setGradient,
  };
};
