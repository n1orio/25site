import type { Ref } from "vue"

const DURATION = 520
const FADE = 200

/**
 * Круговое раскрытие новой темы из точки клика.
 * Тема переключается, когда круг уже закрыл бо́льшую часть экрана,
 * после чего слой мягко гаснет — без «щелчка» на середине.
 */
export const useThemeCircle = (isDark: Ref<boolean>) => {
  const isAnimating = ref(false)

  // слой ищем лениво: к моменту клика он гарантированно в DOM
  const getLayer = () => document.getElementById("theme-circle")
  let layer: HTMLElement | null = null

  const readVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()

  const paint = (targetDark: boolean) => {
    if (!layer) return
    const bg = readVar(targetDark ? "--theme-bg-dark" : "--theme-bg-light")
    layer.style.background = bg || (targetDark ? "#101014" : "#f4f4f5")
  }

  const reset = () => {
    if (!layer) return
    layer.style.clipPath = ""
    layer.style.opacity = "0"
    isAnimating.value = false
  }

  const toggle = async (event?: MouseEvent) => {
    if (isAnimating.value) return

    const targetDark = !isDark.value
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    layer = getLayer()

    if (!layer || reduced || !event) {
      isDark.value = targetDark
      return
    }

    isAnimating.value = true
    paint(targetDark)

    const { clientX: x, clientY: y } = event
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const grow = layer.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
      ],
      {
        duration: DURATION,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    )

    // переключаем тему, когда круг закрыл большую часть экрана
    const swap = window.setTimeout(() => { isDark.value = targetDark }, DURATION * 0.42)
    await grow.finished.catch(() => {})

    const fade = layer.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FADE,
      easing: "ease-out",
      fill: "forwards",
    })
    await fade.finished.catch(() => {})

    window.clearTimeout(swap)
    grow.cancel()
    fade.cancel()
    reset()
  }

  return { toggle, isAnimating }
}
