// app/composables/useI18nEditMode.ts
// Provides edit-mode state for inline i18n translation editing on public pages.
// Handles text editing (data-i18n), image replace (data-nuxiox-img), and link editing (data-nuxiox-link).
import { unflatten } from "~~/packages/base/utils/flatten"

export const useI18nEditMode = () => {
  const isEditMode = ref(false)
  const editingKey = ref<string | null>(null)
  const editingValue = ref("")
  const editingLocales = ref<string[]>([])
  const editPosition = ref({ x: 0, y: 0 })
  // Image editing state
  const editingImageKey = ref<string | null>(null)
  // Link editing state
  const editingLinkKey = ref<string | null>(null)
  const editingLinkHref = ref("")
  let badgeElements: HTMLElement[] = []
  let imageBadgeElements: HTMLElement[] = []
  let linkBadgeElements: HTMLElement[] = []
  // MutationObserver — re-injects badges when async-loaded sections mount
  let domObserver: MutationObserver | null = null

  const { t, mergeLocaleMessage, locale } = useI18n()

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value
    if (!isEditMode.value) {
      editingKey.value = null
      editingImageKey.value = null
      editingLinkKey.value = null
      cleanupBadges()
      cleanupImageBadges()
      cleanupLinkBadges()
      cleanupStyles()
      stopDomObserver()
    } else {
      injectBadges()
      injectImageBadges()
      injectLinkBadges()
      startDomObserver()
    }
  }

  function openEditor(key: string, x: number, y: number) {
    editingKey.value = key
    editingValue.value = t(key)
    editingLocales.value = [locale.value]
    editPosition.value = { x, y }
  }

  function closeEditor() {
    editingKey.value = null
    editingValue.value = ""
  }

  async function saveOverride() {
    if (!editingKey.value) return
    const payload: Record<string, Record<string, string>> = {}
    for (const loc of editingLocales.value) {
      payload[loc] = { [editingKey.value]: editingValue.value }
    }
    try {
      await $fetch("/api/i18n", { method: "PUT", body: payload })
      for (const loc of editingLocales.value) {
        mergeLocaleMessage(loc, unflatten(payload[loc]))
      }
      closeEditor()
    } catch (e) {
      console.error("Failed to save i18n override:", e)
    }
  }

  // ─── DOM Observer — watches for async-loaded sections ──────────────

  function startDomObserver() {
    stopDomObserver()
    let timer: ReturnType<typeof setTimeout> | null = null
    domObserver = new MutationObserver(() => {
      // Debounce: batch rapid mutations within 100ms
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        // Text badges
        document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
          if (badgeElements.some((b) => b.parentElement === el)) return
          el.style.position = "relative"
          el.style.outline = "2px dashed transparent"
          el.style.outlineOffset = "0px"
          el.style.transition = "outline-color 0.2s"
          el.addEventListener("mouseenter", onElMouseEnter)
          el.addEventListener("mouseleave", onElMouseLeave)
          el.addEventListener("click", onElClick)
          const badge = createBadge("&#xf044;", "#3b82f6")
          el.appendChild(badge)
          badgeElements.push(badge)
        })
        // Image badges
        document.querySelectorAll<HTMLElement>("[data-nuxiox-img]").forEach((el) => {
          if (imageBadgeElements.some((b) => b.parentElement === el)) return
          el.style.position = "relative"
          const badge = createBadge("&#xf030;", "#8b5cf6")
          el.appendChild(badge)
          imageBadgeElements.push(badge)
          el.addEventListener("mouseenter", onImgMouseEnter)
          el.addEventListener("mouseleave", onImgMouseLeave)
          el.addEventListener("click", onImgClick)
        })
        // Link badges
        document.querySelectorAll<HTMLElement>("[data-nuxiox-link]").forEach((el) => {
          if (linkBadgeElements.some((b) => b.parentElement === el)) return
          el.style.position = "relative"
          const badge = createBadge("&#xf0c1;", "#059669")
          el.appendChild(badge)
          linkBadgeElements.push(badge)
          el.addEventListener("mouseenter", onLinkMouseEnter)
          el.addEventListener("mouseleave", onLinkMouseLeave)
          el.addEventListener("click", onLinkClick)
        })
        timer = null
      }, 100)
    })
    domObserver.observe(document.body, { childList: true, subtree: true })
  }

  function stopDomObserver() {
    if (domObserver) {
      domObserver.disconnect()
      domObserver = null
    }
  }

  // ─── Text badges (data-i18n) ────────────────────────────────────────

  function injectBadges() {
    cleanupBadges()
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
      if (["IMG", "INPUT", "BR", "HR", "META", "LINK", "AREA", "BASE", "COL", "EMBED", "SOURCE", "TRACK", "WBR"].includes(el.tagName)) return
      attachTextBadge(el)
    })
  }

  function attachTextBadge(el: HTMLElement) {
    el.style.position = "relative"
    el.style.outline = "2px dashed transparent"
    el.style.outlineOffset = "0px"
    el.style.transition = "outline-color 0.2s"
    el.addEventListener("mouseenter", onElMouseEnter)
    el.addEventListener("mouseleave", onElMouseLeave)
    el.addEventListener("click", onElClick)
    const badge = createBadge("&#xf044;", "#3b82f6")
    el.appendChild(badge)
    badgeElements.push(badge)
  }

  // ─── Image badges (data-nuxiox-img) ─────────────────────────────────

  function injectImageBadges() {
    cleanupImageBadges()
    document.querySelectorAll<HTMLElement>("[data-nuxiox-img]").forEach((el) => {
      el.style.position = "relative"
      const badge = createBadge("&#xf030;", "#8b5cf6")
      el.appendChild(badge)
      imageBadgeElements.push(badge)
      el.addEventListener("mouseenter", onImgMouseEnter)
      el.addEventListener("mouseleave", onImgMouseLeave)
      el.addEventListener("click", onImgClick)
    })
  }

  // ─── Link badges (data-nuxiox-link) ─────────────────────────────────

  function injectLinkBadges() {
    cleanupLinkBadges()
    document.querySelectorAll<HTMLElement>("[data-nuxiox-link]").forEach((el) => {
      el.style.position = "relative"
      const badge = createBadge("&#xf0c1;", "#059669")
      el.appendChild(badge)
      linkBadgeElements.push(badge)
      el.addEventListener("mouseenter", onLinkMouseEnter)
      el.addEventListener("mouseleave", onLinkMouseLeave)
      el.addEventListener("click", onLinkClick)
    })
  }

  function createBadge(icon: string, color: string): HTMLElement {
    const badge = document.createElement("span")
    badge.className = "i18n-edit-badge"
    badge.innerHTML = icon
    badge.style.cssText = [
      "position: absolute !important",
      "top: -10px !important",
      "right: -10px !important",
      "width: 22px !important",
      "height: 22px !important",
      `background: ${color} !important`,
      "color: white !important",
      "font-family: 'Font Awesome 6 Free','Font Awesome 5 Free',sans-serif !important",
      "font-weight: 900 !important",
      "font-size: 11px !important",
      "border-radius: 50% !important",
      "display: flex !important",
      "align-items: center !important",
      "justify-content: center !important",
      "pointer-events: none !important",
      "z-index: 9998 !important",
      "line-height: 1 !important",
      "box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important",
      "opacity: 0 !important",
      "transition: opacity 0.2s !important",
    ].join(";")
    return badge
  }

  // ─── Image handlers ────────────────────────────────────────────────

  function onImgMouseEnter(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outline = "2px dashed #8b5cf6"
    el.style.outlineOffset = "2px"
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "1"
  }

  function onImgMouseLeave(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outline = ""
    el.style.outlineOffset = ""
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "0"
  }

  function onImgClick(e: Event) {
    if (!isEditMode.value) return
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    const key = el.getAttribute("data-nuxiox-img") || ""
    editingImageKey.value = key
  }

  // Called from toolbar when user selects a media item from the library
  async function onImageSelected(media: any) {
    const key = editingImageKey.value
    if (!key || !media) return
    const url = `/api/admin/media/${media.id}/file`

    // Update the image src immediately
    const el = document.querySelector<HTMLElement>(`[data-nuxiox-img="${key}"]`)
    if (el) {
      if (el.tagName === "IMG") {
        (el as HTMLImageElement).src = url
      }
    }

    // Save to API
    try {
      await $fetch("/api/i18n", {
        method: "PUT",
        body: { _images: { [key]: url } },
      })
      // Refresh overrides so the i18n-overrides plugin picks up the new value
      // This prevents the MutationObserver from reverting to stale data
      await refreshNuxtData("i18n-overrides")
    } catch (e) {
      console.error("Failed to save image override:", e)
    }
    editingImageKey.value = null
  }

  // ─── Link handlers ──────────────────────────────────────────────────

  function onLinkMouseEnter(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outline = "2px dashed #059669"
    el.style.outlineOffset = "2px"
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "1"
  }

  function onLinkMouseLeave(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outline = ""
    el.style.outlineOffset = ""
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "0"
  }

  function onLinkClick(e: Event) {
    if (!isEditMode.value) return
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    const key = el.getAttribute("data-nuxiox-link") || ""
    editingLinkKey.value = key
    editingLinkHref.value = (el as HTMLAnchorElement).href || ""
  }

  // Called from toolbar when user saves a new link URL
  async function onLinkSaved(key: string, newHref: string) {
    if (!key) return

    // Update the href immediately
    const el = document.querySelector<HTMLElement>(`[data-nuxiox-link="${key}"]`)
    if (el && el.tagName === "A") {
      ;(el as HTMLAnchorElement).href = newHref
    }

    // Save to API
    try {
      await $fetch("/api/i18n", {
        method: "PUT",
        body: { _links: { [key]: newHref } },
      })
      await refreshNuxtData("i18n-overrides")
    } catch (e) {
      console.error("Failed to save link override:", e)
    }
    editingLinkKey.value = null
  }

  // ─── Text event handlers ────────────────────────────────────────────

  function onElMouseEnter(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outlineColor = "#3b82f6"
    el.style.outlineOffset = "2px"
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "1"
  }

  function onElMouseLeave(e: Event) {
    const el = e.currentTarget as HTMLElement
    el.style.outlineColor = "transparent"
    el.style.outlineOffset = "0px"
    const badge = el.querySelector(".i18n-edit-badge") as HTMLElement
    if (badge) badge.style.opacity = "0"
  }

  function onElClick(e: Event) {
    if (!isEditMode.value) return
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    const key = el.getAttribute("data-i18n") || ""
    const rect = el.getBoundingClientRect()
    openEditor(key, rect.left, rect.bottom + 8)
  }

  function cleanupBadges() {
    badgeElements.forEach((b) => b.remove())
    badgeElements = []
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
      el.removeEventListener("mouseenter", onElMouseEnter)
      el.removeEventListener("mouseleave", onElMouseLeave)
      el.removeEventListener("click", onElClick)
      el.style.outline = ""
      el.style.outlineOffset = ""
      el.style.position = ""
      el.style.transition = ""
    })
  }

  function cleanupImageBadges() {
    imageBadgeElements.forEach((b) => b.remove())
    imageBadgeElements = []
    document.querySelectorAll<HTMLElement>("[data-nuxiox-img]").forEach((el) => {
      el.removeEventListener("mouseenter", onImgMouseEnter)
      el.removeEventListener("mouseleave", onImgMouseLeave)
      el.removeEventListener("click", onImgClick)
      el.style.outline = ""
      el.style.outlineOffset = ""
      el.style.position = ""
    })
  }

  function cleanupLinkBadges() {
    linkBadgeElements.forEach((b) => b.remove())
    linkBadgeElements = []
    document.querySelectorAll<HTMLElement>("[data-nuxiox-link]").forEach((el) => {
      el.removeEventListener("mouseenter", onLinkMouseEnter)
      el.removeEventListener("mouseleave", onLinkMouseLeave)
      el.removeEventListener("click", onLinkClick)
      el.style.outline = ""
      el.style.outlineOffset = ""
      el.style.position = ""
    })
  }

  function cleanupStyles() {
    document.querySelectorAll(".i18n-edit-badge").forEach((b) => b.remove())
  }

  // ─── Sidebar helpers ────────────────────────────────────────────────

  function collectTextItems() {
    const items: { key: string; text: string }[] = []
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n") || ""
      const text = el.textContent?.trim() || key
      items.push({ key, text: text.slice(0, 80) })
    })
    return items
  }

  function collectImageItems() {
    const items: { key: string; src: string }[] = []
    document.querySelectorAll<HTMLElement>("[data-nuxiox-img]").forEach((el) => {
      const key = el.getAttribute("data-nuxiox-img") || ""
      const src = (el as HTMLImageElement).src || ""
      items.push({ key, src })
    })
    return items
  }

  function collectLinkItems() {
    const items: { key: string; href: string; text: string }[] = []
    document.querySelectorAll<HTMLElement>("[data-nuxiox-link]").forEach((el) => {
      const key = el.getAttribute("data-nuxiox-link") || ""
      const href = (el as HTMLAnchorElement).href || ""
      const text = (el.textContent || "").trim().slice(0, 60)
      items.push({ key, href, text })
    })
    return items
  }

  function scrollToElement(key: string) {
    const el = document.querySelector<HTMLElement>(`[data-i18n="${key}"], [data-nuxiox-img="${key}"], [data-nuxiox-link="${key}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    document.querySelectorAll(".nuxiox-highlight").forEach((h) => {
      h.classList.remove("nuxiox-highlight")
      ;(h as HTMLElement).style.outline = ""
      ;(h as HTMLElement).style.outlineOffset = ""
    })
    el.classList.add("nuxiox-highlight")
    el.style.outline = "3px solid #8b5cf6"
    el.style.outlineOffset = "3px"
    setTimeout(() => {
      el.classList.remove("nuxiox-highlight")
      el.style.outline = ""
      el.style.outlineOffset = ""
    }, 3000)
  }

  return reactive({
    isEditMode,
    editingKey,
    editingValue,
    editingLocales,
    editPosition,
    editingImageKey,
    editingLinkKey,
    editingLinkHref,
    toggleEditMode,
    openEditor,
    closeEditor,
    saveOverride,
    onImageSelected,
    onLinkSaved,
    collectTextItems,
    collectImageItems,
    collectLinkItems,
    scrollToElement,
  })
}