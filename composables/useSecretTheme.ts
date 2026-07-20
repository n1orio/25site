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
    { id: "ruby",  name: "Рубин",  colors: ["#E74C3C", "#C0392B"] },
    { id: "gold",  name: "Золото", colors: ["#FFD93D", "#B8860B"] },
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

  return {
    isDark, themeMode, activeGradient, accentColor, gradientPresets,
    bgPrimary, bgSecondary, primaryColor, secondaryColor,
    setSingleColor, setGradient,
  };
};
