import { onBeforeUnmount, onMounted, watch } from "vue"

/**
 * «Желе» для элементов: точка блика и упругая деформация по осям.
 *
 * Почему без поворота. Раньше карточка тянулась за курсором через
 * perspective + rotateX/rotateY. Это 3D-поворот, и на плоской
 * карточке он читался как переворот, а не как резинка. Желе —
 * это когда элемент тянется в ту сторону, куда его тянут, но
 * остаётся плоским: scaleX растёт, scaleY сжимается.
 *
 * Деформация считается по смещению курсора от центра элемента.
 * Смещение ограничено 22%: при большем элемент вытягивается в
 * блин и форма рассыпается.
 *
 * Атрибуты на элементе:
 *   data-juice      — блик из-под пальца (--px/--py)
 *   data-wobble="N" — упругая деформация, N = амплитуда в процентах
 */
export const useJuiceScope = (root?: Ref<HTMLElement | null>, rescanOn?: () => string) => {
  const cleanups: (() => void)[] = []
  let frame = 0

  /** максимальная деформация в долях размера */
  const MAX_STRETCH = 0.22

  const bind = (node: HTMLElement) => {
    const juice = node.hasAttribute("data-juice")
    const wobble = Number(node.dataset.wobble || 0)
    if (!juice && !wobble) return

    let pending: { x: number; y: number } | null = null

    const flush = () => {
      frame = 0
      const p = pending
      pending = null
      if (!p) return
      const r = node.getBoundingClientRect()
      if (!r.width || !r.height) return

      if (juice) {
        node.style.setProperty("--px", `${(((p.x - r.left) / r.width) * 100).toFixed(2)}%`)
        node.style.setProperty("--py", `${(((p.y - r.top) / r.height) * 100).toFixed(2)}%`)
      }

      if (wobble) {
        // смещение от центра, нормированное на половину размера
        const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v)
        const ox = clamp((p.x - (r.left + r.width / 2)) / (r.width / 2))
        const oy = clamp((p.y - (r.top + r.height / 2)) / (r.height / 2))
        const amp = wobble / 100
        /*
         * Тянемся к курсору: смещение вправо тянет правый край,
         * поэтому элемент шире по X и ниже по Y. Значения
         * взаимно компенсируются — иначе желе «раздувается».
         *
         * Пишем в --_wx/--_wy, а не в --_sx/--_sy: инлайн-стиль
         * из JS сильнее любого CSS-правила, и если писать в те же
         * переменные, сжатие от нажатия просто перестало бы
         * работать на карточке с data-wobble.
         */
        node.style.setProperty("--_wx", (1 + ox * amp).toFixed(4))
        node.style.setProperty("--_wy", (1 - ox * amp * 0.75).toFixed(4))
        node.style.setProperty("--_wobble-lift", `${(-oy * MAX_STRETCH * r.height * 0.35).toFixed(1)}px`)
      }
    }

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    /* курсор ушёл — форма возвращается в покой */
    const onLeave = () => {
      if (!wobble) return
      node.style.setProperty("--_wx", "1")
      node.style.setProperty("--_wy", "1")
      node.style.setProperty("--_wobble-lift", "0px")
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
    for (const node of scope.querySelectorAll<HTMLElement>("[data-juice], [data-wobble]")) {
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