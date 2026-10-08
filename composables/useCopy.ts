/**
 * Копирование в буфер с обратной связью.
 * navigator.clipboard требует защищённого контекста (https или localhost),
 * поэтому есть запасной путь через execCommand.
 */
export const useCopy = (resetMs = 1600) => {
  const copiedKey = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  const fallback = (text: string) => {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand("copy")
    } finally {
      document.body.removeChild(ta)
    }
  }

  const copy = async (text: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        fallback(text)
      }
      copiedKey.value = key
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { copiedKey.value = null }, resetMs)
      return true
    } catch {
      try {
        fallback(text)
        copiedKey.value = key
        return true
      } catch {
        return false
      }
    }
  }

  onUnmounted(() => { if (timer) clearTimeout(timer) })

  return { copy, copiedKey }
}
