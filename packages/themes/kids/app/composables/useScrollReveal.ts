/**
 * useScrollReveal — Observer-based scroll animation composable
 * Adds `data-reveal` attribute to elements and reveals them on scroll
 * Uses IntersectionObserver for performance
 */
export function useScrollReveal() {
  if (import.meta.server) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  onMounted(() => {
    nextTick(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        observer.observe(el)
      })
    })
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })

  return { observer }
}

/**
 * useParallax3D — Mouse-driven 3D tilt effect for claymorphism cards
 */
export function useParallax3D(elRef: Ref<HTMLElement | null>, strength = 8) {
  if (import.meta.server) return

  function onMouseMove(e: MouseEvent) {
    if (!elRef.value) return
    const rect = elRef.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    elRef.value.style.transform = `
      perspective(800px)
      rotateY(${x * strength}deg)
      rotateX(${-y * strength}deg)
      scale3d(1.02, 1.02, 1.02)
    `
  }

  function onMouseLeave() {
    if (!elRef.value) return
    elRef.value.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
    elRef.value.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
  })

  onBeforeUnmount(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseleave', onMouseLeave)
  })
}