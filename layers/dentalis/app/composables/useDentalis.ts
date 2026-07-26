/**
 * useThreeParticles — Three.js 3D particle system
 * Creates a floating particle field that reacts to scroll
 */
export function useThreeParticles() {
  if (import.meta.server) return

  let scene: any, camera: any, renderer: any, particles: any
  let mouseX = 0, mouseY = 0
  let scrollY = 0
  let animFrame: number

  function init(canvas: HTMLCanvasElement) {
    const THREE = (window as any).THREE
    if (!THREE) return

    const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight }

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
    camera.position.z = 30

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create particles
    const count = 400
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    // Gold color
    const gold = new THREE.Color('#A16207')
    const white = new THREE.Color('#FAFAF9')
    const dark = new THREE.Color('#44403C')

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      const choice = Math.random()
      const c = choice < 0.4 ? gold : choice < 0.7 ? white : dark
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 3 + 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Event listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    animate()
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1
  }

  function onScroll() {
    scrollY = window.scrollY
  }

  function onResize() {
    if (!camera || !renderer) return
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }

  function animate() {
    animFrame = requestAnimationFrame(animate)
    if (!particles || !camera) return

    // Rotate slowly
    particles.rotation.y += 0.0005
    particles.rotation.x += 0.0002

    // Follow mouse subtly
    particles.rotation.y += mouseX * 0.0003
    particles.rotation.x += mouseY * 0.0002

    // React to scroll — move camera
    camera.position.y = -scrollY * 0.003

    renderer.render(scene, camera)
  }

  function cleanup() {
    cancelAnimationFrame(animFrame)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    renderer?.dispose()
  }

  return { init, cleanup }
}

/**
 * useScrollReveal — IntersectionObserver for scroll animations
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
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  )

  onMounted(() => {
    nextTick(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    })
  })

  onBeforeUnmount(() => observer.disconnect())

  return { observer }
}

/**
 * use3DTilt — Mouse-driven 3D tilt effect
 */
export function use3DTilt(elRef: Ref<HTMLElement | null>, strength = 6) {
  if (import.meta.server) return

  function onMove(e: MouseEvent) {
    const el = elRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`
  }

  function onLeave() {
    const el = elRef.value
    if (!el) return
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)'
    el.style.transition = 'transform 0.5s ease-out'
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  })

  onBeforeUnmount(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  })
}