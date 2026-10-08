import { ref, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

/**
 * Состояние навигации общее для приложения.
 *
 * `navScrollRef` привязывается только в компоненте Navigation, а
 * `useNavigation()` вызывается ещё и в app.vue. Пока состояние было
 * локальным, у app.vue всегда был null: подсказки о прокрутке не
 * появлялись, активная вкладка не центрировалась, resize ни на что
 * не влиял.
 */
const navScrollRef = ref<HTMLElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)
const navIndicator = ref({ left: 0, width: 0, visible: false })
/** слушатели и наблюдатель ставятся один раз на всё приложение */
let initialized = false

export const useNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  const routesList = ["/", "/projects", "/uses", "/now"]

  const cleanPath = (path: string) => {
    const p = path.replace(/\/$/, "")
    return p === "" ? "/" : p
  }

  const updateArrows = () => {
    if (!navScrollRef.value) return
    const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.value
    showLeftArrow.value = scrollLeft > 5
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth - 5
  }

  const updateNavIndicator = () => {
    if (!navScrollRef.value) return
    const activeEl = navScrollRef.value.querySelector(".router-link-exact-active")
    if (!activeEl) {
      navIndicator.value.visible = false
      return
    }
    const navRect = navScrollRef.value.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    navIndicator.value = {
      left: activeRect.left - navRect.left + navScrollRef.value.scrollLeft,
      width: activeRect.width,
      visible: true,
    }
  }

  const handleNavScroll = () => {
    updateArrows()
    updateNavIndicator()
  }

  const centerActiveTab = () => {
    if (!navScrollRef.value) return
    const activeEl = navScrollRef.value.querySelector(".router-link-exact-active")
    if (!activeEl) return
    const navRect = navScrollRef.value.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    navScrollRef.value.scrollBy({
      left: activeRect.left - navRect.left - navRect.width / 2 + activeRect.width / 2,
      behavior: "smooth",
    })
  }

  const scrollNav = (direction: "left" | "right") => {
    if (!navScrollRef.value) return
    navScrollRef.value.scrollBy({
      left: direction === "left" ? -140 : 140,
      behavior: "smooth",
    })
  }

  // Блокировка прыжка скролла
  let savedScrollPosition = 0
  router.beforeEach((to, from) => {
    if (routesList.includes(cleanPath(to.path)) && routesList.includes(cleanPath(from.path))) {
      savedScrollPosition = window.scrollY
    }
  })
  router.afterEach((to, from) => {
    if (routesList.includes(cleanPath(to.path)) && routesList.includes(cleanPath(from.path))) {
      nextTick(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: "instant" })
      })
    }
  })

  // Свайп по контенту
  let touchStartX = 0, touchStartY = 0
  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStartX = touch.clientX
    touchStartY = touch.clientY
  }
  const onTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0]
    if (!touch) return
    const diffX = touch.clientX - touchStartX
    const diffY = touch.clientY - touchStartY
    if (Math.abs(diffX) > 60 && Math.abs(diffY) < 45) {
      const currentIdx = routesList.indexOf(cleanPath(route.path))
      if (currentIdx !== -1) {
        if (diffX < 0 && currentIdx < routesList.length - 1) {
          const next = routesList[currentIdx + 1]
          if (next) router.push(next)
        } else if (diffX > 0 && currentIdx > 0) {
          const prev = routesList[currentIdx - 1]
          if (prev) router.push(prev)
        }
      }
    }
  }

  let resizeObserver: ResizeObserver | undefined

  const initNav = () => {
    // повторные вызовы (например с других страниц) не плодят слушатели
    if (initialized) {
      updateArrows()
      return
    }
    initialized = true
    setTimeout(() => {
      updateArrows()
      centerActiveTab()
      updateNavIndicator()
    }, 350)
    window.addEventListener("resize", () => {
      updateArrows()
      updateNavIndicator()
    })
    // Ширина вкладок меняется после загрузки шрифтов и смены темы —
    // без этого подсказки о прокрутке оставались бы неверными.
    // ResizeObserver тут не годится: у прокручиваемого трека его
    // собственная ширина не меняется, меняется только содержимое.
    if (navScrollRef.value) {
      resizeObserver = new ResizeObserver(() => updateArrows())
      resizeObserver.observe(navScrollRef.value)
    }
    document.fonts?.ready
      .then(() => { updateArrows(); centerActiveTab() })
      .catch(() => {})
  }

  watch(() => route.path, () => {
    nextTick(() => {
      updateArrows()
      centerActiveTab()
      updateNavIndicator()
    })
  })

  const destroyNav = () => {
    window.removeEventListener("resize", updateArrows)
    resizeObserver?.disconnect()
  }

  return {
    navScrollRef, showLeftArrow, showRightArrow, navIndicator,
    routesList, handleNavScroll, scrollNav, onTouchStart, onTouchEnd,
    initNav, destroyNav,
  }
}
