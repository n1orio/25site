import { ref, onMounted, onUnmounted } from "vue"

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

export const useCursor = (primaryColor: any, contrastColor: any) => {
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
  /** сколько кадров ещё дорисовываем после последнего движения мыши */
  let idleFrames = 0
  /** вкладка скрыта — останавливаем цикл совсем */
  let paused = false
  const IDLE_FRAMES = 3
  let hoverTarget: HTMLElement | null = null
  let animationFrameId: number | null = null
  let cachedBorderRadius = "4px"

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

  const updateColor = () => {
    const t = 0.12
    color.r += (colorTarget[0] - color.r) * t
    color.g += (colorTarget[1] - color.g) * t
    color.b += (colorTarget[2] - color.b) * t
    if (cursorRef.value) {
      cursorRef.value.style.setProperty(
        "--cursor-color",
        `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`,
      )
    }
  }

  const updateCursor = () => {
    if (paused || !cursorRef.value) {
      animationFrameId = requestAnimationFrame(updateCursor)
      return
    }
    // на простое дорисовываем только пока анимация не «успокоилась»
    if (idleFrames > 0) {
      idleFrames -= 1
      if (idleFrames === 0) {
        animationFrameId = requestAnimationFrame(updateCursor)
        return
      }
    }
    if (cursorRef.value) {
      cursorRef.value.style.setProperty("--cursor-radius", cachedBorderRadius)
      updateColor()

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
        cursorX += (mouseX - cursorX) * 0.35
        cursorY += (mouseY - cursorY) * 0.35
        cursorWidth += (14 - cursorWidth) * 0.35
        cursorHeight += (14 - cursorHeight) * 0.35
        cursorRotation = (cursorRotation + 1.5) % 360
      }

      cursorRef.value.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${cursorRotation}deg)`
      cursorRef.value.style.width = `${cursorWidth}px`
      cursorRef.value.style.height = `${cursorHeight}px`
    }
    animationFrameId = requestAnimationFrame(updateCursor)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!hasMoved) {
      cursorX = e.clientX; cursorY = e.clientY
      color.r = colorTarget[0]; color.g = colorTarget[1]; color.b = colorTarget[2]
      hasMoved = true
    }
    mouseX = e.clientX; mouseY = e.clientY
    if (idleFrames <= 0) idleFrames = IDLE_FRAMES
    isCursorVisible.value = true
  }

  const onMouseOver = (e: MouseEvent) => {
    const el = e.target as HTMLElement

    isOverAccent.value = !!el.closest(ACCENT_SURFACE)
    syncTarget()

    const target = el.closest(INTERACTIVE) as HTMLElement | null
    if (target) {
      hoverTarget = target
      isHovering.value = true
      const radius = window.getComputedStyle(target).borderRadius
      cachedBorderRadius = radius === "0px" ? "6px" : radius
    }
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
  }

  const onMouseLeave = () => {
    isCursorVisible.value = false
    idleFrames = 0
  }
  const onVisibility = () => {
    paused = document.hidden
    if (!paused) idleFrames = IDLE_FRAMES
  }

  const startCursor = () => {
    syncTarget()
    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("visibilitychange", onVisibility)
    animationFrameId = requestAnimationFrame(updateCursor)
  }

  const stopCursor = () => {
    window.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseover", onMouseOver)
    document.removeEventListener("mouseout", onMouseOut)
    document.removeEventListener("mouseleave", onMouseLeave)
    document.removeEventListener("visibilitychange", onVisibility)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }

  return {
    cursorRef, isCursorVisible, isHovering, startCursor, stopCursor,
  }
}
