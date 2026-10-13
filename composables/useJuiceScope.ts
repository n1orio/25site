import { onMounted, onBeforeUnmount, watch } from "vue"

/**
 * Глобальная «жвачка»: цепляется ко всем элементам с
 * [data-juicy] внутри контейнера и на очистку.
 *
 * Зачем сканировать DOM, а не вести ref в каждом компоненте:
 * разметка помечает себя сама (data-juicy="4" — это ещё и
 * максимальный наклон в градусах), а composable один на
 * приложение. Иначе в каждом из десятка компонентов дублировался
 * бы одинаковый код.
 *
 * Атрибуты на элементе:
 *   data-juice      — блик из-под пальца (--px/--py)
 *   data-tilt="N"   — наклон к курсору на N градусов (--tilt-x/--tilt-y);
 *                     сам наклон применяет CSS-класс .juicy-tilt,
 *                     этот атрибут только считает значения
 *
 * Пересчёт идёт через rAF: pointermove шлёт события заметно
 * чаще, чем браузер рисует кадры.
 */
export const useJuiceScope = (root?: Ref<HTMLElement | null>, rescanOn?: () => string) => {
  const cleanups: (() => void)[] = []
  let frame = 0

  const bind = (node: HTMLElement) => {
    const juice = node.hasAttribute("data-juice")
    const maxTilt = Number(node.dataset.tilt || 0)
    const useTilt = maxTilt > 0

    // без блика и без наклона вешать слушатели незачем
    if (!juice && !useTilt) return

    let pending: { x: number; y: number } | null = null

    const flush = () => {
      frame = 0
      const p = pending
      pending = null
      if (!p) return
      const r = node.getBoundingClientRect()
      if (!r.width || !r.height) return
      // наведение: переключаем на мгновенное слежение за курсором
      if (useTilt) node.classList.add("is-tracking")

      if (juice) {
        node.style.setProperty("--px", `${(((p.x - r.left) / r.width) * 100).toFixed(2)}%`)
        node.style.setProperty("--py", `${(((p.y - r.top) / r.height) * 100).toFixed(2)}%`)
      }
      if (useTilt) {
        const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v)
        const ox = (p.x - (r.left + r.width / 2)) / (r.width / 2)
        const oy = (p.y - (r.top + r.height / 2)) / (r.height / 2)
        node.style.setProperty("--tilt-y", `${(clamp(ox) * maxTilt).toFixed(2)}deg`)
        node.style.setProperty("--tilt-x", `${(-clamp(oy) * maxTilt).toFixed(2)}deg`)
      }
    }

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    /**
     * Курсор ушёл с элемента — возвращаем наклон в ноль и снимаем
     * мгновенное слежение.
     *
     * Раньше сброс стоял ещё и на pointerup, и это было ошибкой:
     * после отпускания кнопки мыши курсор остаётся над карточкой,
     * а наклон пропадал и карточка дёргалась обратно. Убираем
     * наклон только когда курсор действительно ушёл.
     */
    const onLeave = () => {
      node.classList.remove("is-tracking")
      if (!useTilt) return
      node.style.setProperty("--tilt-x", "0deg")
      node.style.setProperty("--tilt-y", "0deg")
    }

    node.addEventListener("pointermove", onMove, { passive: true })
    node.addEventListener("pointerleave", onLeave, { passive: true })
    node.addEventListener("pointercancel", onLeave, { passive: true })

    cleanups.push(() => {
      node.removeEventListener("pointermove", onMove)
      node.removeEventListener("pointerleave", onLeave)
      node.removeEventListener("pointercancel", onLeave)
    })
  }

  const scan = () => {
    for (const fn of cleanups) fn()
    cleanups.length = 0
    const scope = root?.value ?? document.body
    if (!scope) return
    for (const node of scope.querySelectorAll<HTMLElement>("[data-juicy], [data-tilt]")) {
      bind(node)
    }
  }

  const teardown = () => {
    for (const fn of cleanups) fn()
    cleanups.length = 0
    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  onMounted(scan)
  // NuxtPage пересоздаёт разметку внутри той же обёртки, поэтому
  // ref не меняется — пересканируем по ключу (обычно маршруту)
  if (rescanOn) watch(rescanOn, scan)
  onBeforeUnmount(teardown)

  return { rescan: scan }
}