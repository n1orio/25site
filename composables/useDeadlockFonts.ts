import type { Ref } from "vue"

/**
 * Шрифты темы «Дедлок» (Russo One / Podkova / Fira Sans Condensed)
 * весят около 300 КБ, поэтому тянутся только когда тема включена:
 * useHead реактивен, и <link> появляется и исчезает вместе с темой.
 */
const DEADLOCK_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Podkova:wght@400;500;600;700;800&family=Fira+Sans+Condensed:wght@400;700;900&family=Russo+One&display=swap"

export const useDeadlockFonts = (enabled: Ref<boolean>) => {
  useHead(() => ({
    link: enabled.value
      ? [{ rel: "stylesheet", href: DEADLOCK_FONTS_HREF, key: "deadlock-fonts" }]
      : [],
  }))
}
