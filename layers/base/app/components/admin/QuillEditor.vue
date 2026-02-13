<script setup lang="ts">
type QuillCtor = new (element: Element, options: Record<string, unknown>) => {
  root: HTMLElement
  on: (eventName: string, handler: () => void) => void
}

declare global {
  interface Window {
    Quill?: QuillCtor
  }
}

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editorEl = ref<HTMLDivElement | null>(null)
let quill: { root: HTMLElement; on: (eventName: string, handler: () => void) => void } | null = null
let syncing = false

const ensureQuillLoaded = async () => {
  if (window.Quill) return

  const cssHref = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css'
  if (!document.querySelector(`link[href="${cssHref}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = cssHref
    document.head.appendChild(link)
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-quill="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Quill script.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js'
    script.dataset.quill = 'true'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Quill script.'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  if (!editorEl.value) return
  await ensureQuillLoaded()
  if (!window.Quill) return

  quill = new window.Quill(editorEl.value, {
    theme: 'snow',
    modules: {
      toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ list: 'ordered' }, { list: 'bullet' }], ['blockquote', 'code-block', 'link', 'image'], [{ align: [] }], ['clean']],
    },
  })

  quill.root.innerHTML = props.modelValue || ''
  quill.on('text-change', () => {
    if (!quill || syncing) return
    emit('update:modelValue', quill.root.innerHTML)
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!quill) return
    if (quill.root.innerHTML === value) return
    syncing = true
    quill.root.innerHTML = value || ''
    syncing = false
  }
)
</script>

<template>
  <div class="rounded-lg border border-base-300 bg-base-100 p-2">
    <div ref="editorEl" class="min-h-[14rem]" />
  </div>
</template>
