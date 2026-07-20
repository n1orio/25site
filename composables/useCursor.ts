import { ref, onMounted, onUnmounted } from "vue"

export const useCursor = (primaryColor: any) => {
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

  const updateCursor = () => {
    if (cursorRef.value) {
      cursorRef.value.style.setProperty("--cursor-color", primaryColor.value)
      cursorRef.value.style.setProperty("--cursor-radius", cachedBorderRadius)

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
      hasMoved = true
    }
    mouseX = e.clientX; mouseY = e.clientY
    isCursorVisible.value = true
  }

  const onMouseOver = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(
      'a, button, input, .cursor-pointer, .nav-link, label, [role="button"]',
    ) as HTMLElement | null
    if (target) {
      hoverTarget = target
      isHovering.value = true
      let radius = window.getComputedStyle(target).borderRadius
      cachedBorderRadius = radius === "0px" ? "6px" : radius
    }
  }

  const onMouseOut = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(
      'a, button, input, .cursor-pointer, .nav-link, label, [role="button"]',
    ) as HTMLElement | null
    if (target && target === hoverTarget) {
      hoverTarget = null
      isHovering.value = false
      cachedBorderRadius = "4px"
    }
  }

  const onMouseLeave = () => { isCursorVisible.value = false }

  const startCursor = () => {
    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)
    document.addEventListener("mouseleave", onMouseLeave)
    animationFrameId = requestAnimationFrame(updateCursor)
  }

  const stopCursor = () => {
    window.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseover", onMouseOver)
    document.removeEventListener("mouseout", onMouseOut)
    document.removeEventListener("mouseleave", onMouseLeave)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }

  return {
    cursorRef, isCursorVisible, isHovering, startCursor, stopCursor,
  }
}
