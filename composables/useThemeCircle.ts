import type { Ref } from "vue"

const DURATION = 520
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)"

type Apply = () => void

/**
 * Переключение темы «радужкой»: старая тема отступает от краёв
 * к точке клика, открывая новую.
 *
 * View Transitions позволяют анимировать не плоскую заливку,
 * а реальный снимок старой темы — поэтому эффект лишён мигания.
 * Без поддержки API используется слой с цветом текущего фона:
 * он совпадает с фоном, поэтому стыка не видно.
 */
export const useThemeCircle = (isDark: Ref<boolean>) => {
  const isAnimating = ref(false)
  let layer: HTMLElement | null = null

  const getLayer = () => document.getElementById("theme-circle")
  const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

  const radiusAt = (x: number, y: number) =>
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const reset = () => {
    if (!layer) return
    layer.style.opacity = "0"
    layer.style.clipPath = "circle(0px)"
    isAnimating.value = false
  }

  /** Сжимающийся круг со слоем — fallback без View Transitions. */
  const shrink = async (event: MouseEvent, apply: Apply) => {
    layer = getLayer()
    if (!layer) {
      apply()
      return
    }

    isAnimating.value = true
    const currentBg = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-primary").trim()

    const { clientX: x, clientY: y } = event
    const radius = radiusAt(x, y)

    layer.style.background = currentBg || "#101014"
    layer.style.opacity = "1"
    layer.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`

    const shrinkAnim = layer.animate(
      [
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        { clipPath: `circle(0px at ${x}px ${y}px)` },
      ],
      { duration: DURATION, easing: EASING, fill: "forwards" },
    )

    // переключаем, когда радужка закрыла бо́льшую часть экрана
    const swap = window.setTimeout(apply, DURATION * 0.45)
    await shrinkAnim.finished.catch(() => {})
    window.clearTimeout(swap)
    shrinkAnim.cancel()
    reset()
  }

  /** Основной путь: снимок старой темы сжимается, открывая новую. */
  const iris = async (event: MouseEvent, apply: Apply) => {
    if (isAnimating.value) return

    if (reduced() || typeof document.startViewTransition !== "function") {
      if (reduced()) apply()
      else await shrink(event, apply)
      return
    }

    isAnimating.value = true
    const { clientX: x, clientY: y } = event
    const radius = radiusAt(x, y)

    const transition = document.startViewTransition(apply)
    try {
      await transition.ready
      document.documentElement.animate(
        {
          clipPath: [
            `circle(${radius}px at ${x}px ${y}px)`,
            `circle(0px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: DURATION,
          easing: EASING,
          pseudoElement: "::view-transition-old(root)",
        },
      )
    } catch {
      /* анимация не запустилась — тема уже переключена */
    }
    await transition.finished.catch(() => {})
    isAnimating.value = false
  }

  const toggle = (event?: MouseEvent) => {
    const apply = () => { isDark.value = !isDark.value }
    if (!event) {
      apply()
      return
    }
    return iris(event, apply)
  }

  /** Смена акцентного цвета — тем же эффектом, фон не меняется. */
  const flash = (event: MouseEvent, apply: Apply) => {
    if (!event) {
      apply()
      return Promise.resolve()
    }
    return iris(event, apply)
  }

  return { toggle, flash, isAnimating }
}
