// app/plugins/i18n-overrides.ts
// Fetches i18n overrides from the API and merges them into vue-i18n at runtime.
// Re-applies on route change to prevent locale re-init from wiping overrides.
// Also applies _images overrides to [data-nuxiox-img] elements
// and _links overrides to [data-nuxiox-link] elements.
import { unflatten } from "~~/packages/base/utils/flatten"
import type { NuxtApp } from "#app"

export default defineNuxtPlugin({
  name: "i18n:overrides",
  dependsOn: ["i18n:plugin"],

  async setup(nuxtApp: NuxtApp) {
    const { data } = await useAsyncData("i18n-overrides", () =>
      $fetch<Record<string, Record<string, string>>>("/api/i18n").catch(() => ({})),
    )

    function applyImageOverrides(images: Record<string, string>) {
      if (!import.meta.client) return
      for (const [key, url] of Object.entries(images)) {
        document.querySelectorAll<HTMLImageElement>(`[data-nuxiox-img="${key}"]`).forEach((el) => {
          if (el.tagName === "IMG") {
            el.src = url
          }
        })
      }
    }

    function applyLinkOverrides(links: Record<string, string>) {
      if (!import.meta.client) return
      for (const [key, href] of Object.entries(links)) {
        document.querySelectorAll<HTMLAnchorElement>(`[data-nuxiox-link="${key}"]`).forEach((el) => {
          if (el.tagName === "A") {
            el.href = href
          }
        })
      }
    }

    // Watch for async-loaded sections and re-apply as new elements appear
    let imageObserver: MutationObserver | null = null
    function startImageObserver(images: Record<string, string>) {
      if (!import.meta.client || imageObserver) return
      const keys = new Set(Object.keys(images))
      const apply = () => {
        applyImageOverrides(images)
        if (keys.size > 0) {
          const remaining = [...keys].filter(
            (k) => document.querySelector(`[data-nuxiox-img="${k}"]`) === null,
          )
          keys.clear()
          remaining.forEach((k) => keys.add(k))
          if (keys.size === 0 && imageObserver) {
            imageObserver.disconnect()
            imageObserver = null
          }
        }
      }
      imageObserver = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.addedNodes.length > 0)) apply()
      })
      imageObserver.observe(document.body, { childList: true, subtree: true })
    }

    let linkObserver: MutationObserver | null = null
    function startLinkObserver(links: Record<string, string>) {
      if (!import.meta.client || linkObserver) return
      const keys = new Set(Object.keys(links))
      const apply = () => {
        applyLinkOverrides(links)
        if (keys.size > 0) {
          const remaining = [...keys].filter(
            (k) => document.querySelector(`[data-nuxiox-link="${k}"]`) === null,
          )
          keys.clear()
          remaining.forEach((k) => keys.add(k))
          if (keys.size === 0 && linkObserver) {
            linkObserver.disconnect()
            linkObserver = null
          }
        }
      }
      linkObserver = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.addedNodes.length > 0)) apply()
      })
      linkObserver.observe(document.body, { childList: true, subtree: true })
    }

    function applyOverrides() {
      if (data.value && typeof data.value === "object") {
        // Apply _images
        const images = (data.value as any)._images
        if (import.meta.client && images && typeof images === "object") {
          nextTick(() => {
            applyImageOverrides(images as Record<string, string>)
            startImageObserver(images as Record<string, string>)
          })
        }
        // Apply _links
        const links = (data.value as any)._links
        if (import.meta.client && links && typeof links === "object") {
          nextTick(() => {
            applyLinkOverrides(links as Record<string, string>)
            startLinkObserver(links as Record<string, string>)
          })
        }
        // Apply per-locale text overrides
        for (const [locale, overrides] of Object.entries(data.value)) {
          if (locale === "_images" || locale === "_links") continue
          if (overrides && typeof overrides === "object" && Object.keys(overrides).length > 0) {
            try {
              nuxtApp.$i18n.mergeLocaleMessage(locale, unflatten(overrides))
            } catch {
              try {
                const i18n = nuxtApp.vueApp.globalProperties.$i18n
                i18n?.mergeLocaleMessage?.(locale, unflatten(overrides))
              } catch { /* skip */ }
            }
          }
        }
      }
    }

    applyOverrides()

    // Re-apply after each route change (catches locale switches cleanly)
    if (import.meta.client) {
      const route = useRoute()
      watch(
        () => route.fullPath,
        () => { applyOverrides() },
      )
    }
  },
})