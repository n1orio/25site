import { ref, onUnmounted, watch } from "vue"
import type { Ref } from "vue"

type RGB = [number, number, number]

const INTERACTIVE = 'a, button, input, .cursor-pointer, .nav-link, label, [role="button"]'
/* поверхности, залитые акцентом — на них курсор должен быть контрастным */
const ACCENT_SURFACE = ".ds-card, .ds-pill, .ds-action, .ds-scallop, .ds-bar > span"

const hexToRgb = (hex: string): RGB | null => {
  let h = hex.trim().replace("#", "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  if (h.length < 6) return null
  const n = Number.parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const useCursor = (primaryColor: Ref<string>, contrastColor: Ref<string>) => {
  const cursorRef = ref<HTMLElement | null>(null)
  const isCursorVisible = ref(false)
  const isHovering = ref(false)

  let mouseX = -100
  let mouseY = -100
  let cursorX = -100
  let cursorY = -100
  let cursorWidth = 14
  let cursorHeight = 14
  let cursorRotation = 0
  let hasMoved = false
  let hoverTarget: HTMLElement | null = null
  let animationFrameId: number | null = null
  let cachedBorderRadius = "4px"
  /** время последнего реального движения мыши */
  let lastMoveAt = 0
  /** окно, в котором mouseover считается «настоящим» наведением */
  const MOVE_WINDOW = 120
  /** цикл rAF остановлен, пока курсор доехал до цели */
  let paused = false

  // --- цвет курсора: плавно интерполируем между акцентом и контрастом ---
  const color = { r: 255, g: 255, b: 255 }
  const colorTarget: RGB = [255, 255, 255]
  const setTarget = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      colorTarget[0] = rgb[0]
      colorTarget[1] = rgb[1]
      colorTarget[2] = rgb[2]
    }
  }
  const syncTarget = () => {
    setTarget(isOverAccent.value ? contrastColor.value : primaryColor.value)
  }

  const isOverAccent = ref(false)

  /** применённое в DOM значение — чтобы не дёргать стиль без изменений */
  const applied = { r: -1, g: -1, b: -1, radius: "", transform: "", width: -1, height: -1 }

  const tick = () => {
    const el = cursorRef.value
    if (!el) {
      animationFrameId = requestAnimationFrame(tick)
      return
    }

    updateColor()
    moveStep(el)
    writeStyles(el)

    // доехали до цели — останавливаем цикл, разбудим на движении мыши
    const settled =
      !hoverTarget &&
      Math.abs(mouseX - cursorX) < 0.2 &&
      Math.abs(mouseY - cursorY) < 0.2 &&
      Math.abs(14 - cursorWidth) < 0.2 &&
      Math.abs(14 - cursorHeight) < 0.2 &&
      cachedBorderRadius === applied.radius &&
      applied.r === Math.round(color.r) &&
      applied.g === Math.round(color.g) &&
      applied.b === Math.round(color.b)

    if (settled) {
      animationFrameId = null
      return
    }
    animationFrameId = requestAnimationFrame(tick)
  }

  const wake = () => {
    if (paused) return
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(tick)
    }
  }

  /** один шаг интерполяции позиции, размера и поворота */
  const moveStep = (el: HTMLElement) => {
    if (cachedBorderRadius !== applied.radius) {
      applied.radius = cachedBorderRadius
      el.style.setProperty("--cursor-radius", cachedBorderRadius)
    }

    // элемент может исчезнуть из DOM (смена вкладки, удаление карточки):
    // тогда его прямоугольник нулевой и курсор уезжал бы в угол экрана
    if (hoverTarget && !hoverTarget.isConnected) {
      hoverTarget = null
      isHovering.value = false
      cachedBorderRadius = "4px"
    }

    if (hoverTarget) {
      const rect = hoverTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      cursorX += (centerX + (mouseX - centerX) * 0.03 - cursorX) * 0.3
      cursorY += (centerY + (mouseY - centerY) * 0.03 - cursorY) * 0.3

      const targetRot = Math.round(cursorRotation / 90) * 90
      cursorRotation += (targetRot - cursorRotation) * 0.25

      const isVertical = Math.abs(targetRot / 90) % 2 === 1
      cursorWidth += ((isVertical ? rect.height : rect.width) + 16 - cursorWidth) * 0.3
      cursorHeight += ((isVertical ? rect.width : rect.height) + 16 - cursorHeight) * 0.3
    } else {
      const goneX = cursorX
      const goneY = cursorY
      cursorX += (mouseX - cursorX) * 0.35
      cursorY += (mouseY - cursorY) * 0.35
      cursorWidth += (14 - cursorWidth) * 0.35
      cursorHeight += (14 - cursorHeight) * 0.35
      // поворот начисляем за пройденный путь: на ровном месте курсор
      // останавливается, поэтому цикл rAF может засыпать
      if (Math.hypot(cursorX - goneX, cursorY - goneY) > 0.4) {
        cursorRotation = (cursorRotation + 1.2) % 360
      }
    }
  }

  const updateColor = () => {
    const t = 0.12
    color.r += (colorTarget[0] - color.r) * t
    color.g += (colorTarget[1] - color.g) * t
    color.b += (colorTarget[2] - color.b) * t
    const r = Math.round(color.r)
    const g = Math.round(color.g)
    const b = Math.round(color.b)
    if (r === applied.r && g === applied.g && b === applied.b) return
    applied.r = r; applied.g = g; applied.b = b
    cursorRef.value?.style.setProperty("--cursor-color", `rgb(${r}, ${g}, ${b})`)
  }

  const writeStyles = (el: HTMLElement) => {
    const transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${cursorRotation}deg)`
    if (transform !== applied.transform) {
      applied.transform = transform
      el.style.transform = transform
    }
    const width = Number(cursorWidth.toFixed(1))
    const height = Number(cursorHeight.toFixed(1))
    if (width !== applied.width) {
      applied.width = width
      el.style.width = `${width}px`
    }
    if (height !== applied.height) {
      applied.height = height
      el.style.height = `${height}px`
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!hasMoved) {
      cursorX = e.clientX; cursorY = e.clientY
      color.r = colorTarget[0]; color.g = colorTarget[1]; color.b = colorTarget[2]
      hasMoved = true
    }
    mouseX = e.clientX; mouseY = e.clientY
    lastMoveAt = performance.now()
    isCursorVisible.value = true
    wake()
  }

  const onMouseOver = (e: MouseEvent) => {
    const el = e.target as HTMLElement

    isOverAccent.value = !!el.closest(ACCENT_SURFACE)
    syncTarget()

    /*
     * Браузер рассылает mouseover/mouseout и без движения мыши — когда под
     * курсором поменялся элемент: смена вкладки, удаление карточки, сдвиг
     * вёрстки. Без этой проверки курсор распухал вокруг случайной ссылки,
     * оказавшейся под ним, и выглядел сломанным. Настоящее наведение всегда
     * идёт вслед за mousemove, поэтому чужие события игнорируем.
     */
    if (performance.now() - lastMoveAt > MOVE_WINDOW) {
      if (hoverTarget && !hoverTarget.isConnected) {
        hoverTarget = null
        isHovering.value = false
        cachedBorderRadius = "4px"
      }
      wake()
      return
    }

    const target = el.closest(INTERACTIVE) as HTMLElement | null
    if (target) {
      hoverTarget = target
      isHovering.value = true
      const radius = window.getComputedStyle(target).borderRadius
      cachedBorderRadius = radius === "0px" ? "6px" : radius
    }
    wake()
  }

  const onMouseOut = (e: MouseEvent) => {
    const el = e.target as HTMLElement

    // relatedTarget показывает, куда ушёл курсор — пересчитываем поверхность сразу
    const to = e.relatedTarget as HTMLElement | null
    isOverAccent.value = !!to?.closest?.(ACCENT_SURFACE)
    syncTarget()

    const target = el.closest(INTERACTIVE) as HTMLElement | null
    if (target && target === hoverTarget && !to?.closest?.(INTERACTIVE)) {
      hoverTarget = null
      isHovering.value = false
      cachedBorderRadius = "4px"
    }
    wake()
  }

  const onMouseLeave = () => {
    isCursorVisible.value = false
  }
  const onVisibility = () => {
    paused = document.hidden
    if (!paused) wake()
  }

  const startCursor = () => {
    syncTarget()
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    document.addEventListener("mouseover", onMouseOver, { passive: true })
    document.addEventListener("mouseout", onMouseOut, { passive: true })
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("visibilitychange", onVisibility)
    wake()
  }

  const stopCursor = () => {
    window.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseover", onMouseOver)
    document.removeEventListener("mouseout", onMouseOut)
    document.removeEventListener("mouseleave", onMouseLeave)
    document.removeEventListener("visibilitychange", onVisibility)
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // тема поменялась, а мышь стоит на месте — цвет курсора пересчитывает
  // только mouseover, поэтому подтягиваем его сами
  watch([primaryColor, contrastColor, isOverAccent], () => { syncTarget(); wake() })

  onUnmounted(() => { if (animationFrameId !== null) cancelAnimationFrame(animationFrameId) })

  return {
    cursorRef, isCursorVisible, isHovering, startCursor, stopCursor,
  }
}
