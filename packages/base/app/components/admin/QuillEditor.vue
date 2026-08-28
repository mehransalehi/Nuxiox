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
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorEl = ref<HTMLDivElement | null>(null)
const pickerRef = ref<{ open: () => void } | null>(null)
const htmlSource = ref('')
const showHtml = ref(false)
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

function toggleHtmlSource() {
  if (!showHtml.value) {
    // Switching TO source mode: copy current v-model content to textarea
    // textarea will now be the source of truth via its v-model + watcher
    htmlSource.value = props.modelValue || ''
    showHtml.value = true
  } else {
    // Switching BACK to WYSIWYG: textarea content is already in the v-model
    // (synced via the watcher below). Set Quill from it for display purposes.
    showHtml.value = false
    if (quill) {
      // Update Quill's display — it may mangle the HTML but the v-model is safe
      quill.root.innerHTML = htmlSource.value || ''
    }
  }
}

function openMediaLibrary() {
  pickerRef.value?.open()
}

function onMediaSelected(media: any) {
  if (!quill) return
  const imgUrl = `/api/admin/media/${media.id}/file`
  quill.root.innerHTML = quill.root.innerHTML + `<img src="${imgUrl}" alt="${media.alt || ''}" />`
  if (!showHtml.value) {
    emit('update:modelValue', quill.root.innerHTML)
  }
}

onMounted(async () => {
  if (!editorEl.value) return
  await ensureQuillLoaded()
  if (!window.Quill) return

  quill = new window.Quill(editorEl.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block', 'link'],
        [{ align: [] }],
        ['clean'],
      ],
    },
  })

  quill.root.innerHTML = props.modelValue || ''
  quill.on('text-change', () => {
    if (!quill || syncing || showHtml.value) return
    emit('update:modelValue', quill.root.innerHTML)
  })
})

// When in source mode, the watcher syncs textarea back to the v-model
// When in WYSIWYG mode, it syncs external v-model changes to Quill
watch(
  () => props.modelValue,
  (value) => {
    if (showHtml.value) {
      // Sync textarea if v-model changed externally (e.g. loading new post)
      if (htmlSource.value !== value) {
        htmlSource.value = value || ''
      }
      return
    }
    // WYSIWYG mode: sync external v-model changes to Quill
    if (!quill) return
    if (quill.root.innerHTML === value) return
    syncing = true
    quill.root.innerHTML = value || ''
    syncing = false
  },
)

function onSourceInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
  htmlSource.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-base-content/70">Content</span>
      <div class="flex items-center gap-1">
        <button
          class="btn btn-ghost btn-xs gap-1"
          :class="showHtml ? 'text-primary font-semibold' : 'text-base-content/60'"
          type="button"
          @click="toggleHtmlSource"
        >
          <i class="fa-solid fa-code" />
          Source
        </button>
        <button class="btn btn-ghost btn-xs gap-1 text-primary" type="button" @click="openMediaLibrary">
          <i class="fa-solid fa-image" />
          Media Library
        </button>
      </div>
    </div>
    <div class="rounded-lg border border-base-300 bg-base-100 p-2">
      <div v-show="!showHtml" ref="editorEl" class="min-h-[14rem]" />
      <textarea
        v-show="showHtml"
        :value="htmlSource"
        class="textarea textarea-bordered w-full min-h-[14rem] font-mono text-sm"
        placeholder="Write HTML directly..."
        @input="onSourceInput"
      />
    </div>
  </div>
  <AdminMediaLibraryPicker ref="pickerRef" @select="onMediaSelected" />
</template>