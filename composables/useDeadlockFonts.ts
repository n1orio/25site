import type { Ref } from "vue"

/**
 * Шрифты темы «Дедлок» тянутся только когда тема включена:
 * useHead реактивен, и <link> появляется и исчезает вместе с темой.
 *
 * Из внешних осталась одна Podkova — на абзацы. Заголовки и служебный
 * текст набраны TF2 Build, он лежит локально в /fonts и объявлен
 * прямо в deadlock.css, поэтому внешнюю загрузку не требует.
 */
const DEADLOCK_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Podkova:wght@400;500;600;700;800&display=swap"

export const useDeadlockFonts = (enabled: Ref<boolean>) => {
  useHead(() => ({
    link: enabled.value
      ? [{ rel: "stylesheet", href: DEADLOCK_FONTS_HREF, key: "deadlock-fonts" }]
      : [],
  }))
}
