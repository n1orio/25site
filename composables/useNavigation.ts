import { ref, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

export const useNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  const navScrollRef = ref<HTMLElement | null>(null)
  const showLeftArrow = ref(false)
  const showRightArrow = ref(false)
  const navIndicator = ref({ left: 0, width: 0, visible: false })

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
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
  const onTouchEnd = (e: TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX
    const diffY = e.changedTouches[0].clientY - touchStartY
    if (Math.abs(diffX) > 60 && Math.abs(diffY) < 45) {
      const currentIdx = routesList.indexOf(cleanPath(route.path))
      if (currentIdx !== -1) {
        if (diffX < 0 && currentIdx < routesList.length - 1)
          router.push(routesList[currentIdx + 1])
        else if (diffX > 0 && currentIdx > 0)
          router.push(routesList[currentIdx - 1])
      }
    }
  }

  const initNav = () => {
    setTimeout(() => {
      updateArrows()
      centerActiveTab()
      updateNavIndicator()
    }, 350)
    window.addEventListener("resize", () => {
      updateArrows()
      updateNavIndicator()
    })
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
  }

  return {
    navScrollRef, showLeftArrow, showRightArrow, navIndicator,
    routesList, handleNavScroll, scrollNav, onTouchStart, onTouchEnd,
    initNav, destroyNav,
  }
}
