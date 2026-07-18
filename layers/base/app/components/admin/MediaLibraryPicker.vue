<script setup lang="ts">
/**
 * MediaLibraryPicker — reusable daisyUI modal for browsing, uploading,
 * and selecting images from the media library. Emits the selected media
 * object so the parent can insert the image URL wherever needed.
 */
const emit = defineEmits<{
  select: [media: any]
}>()

const modal = ref<HTMLDialogElement | null>(null)
const activeTab = ref<'library' | 'upload'>('library')
const mediaItems = ref<any[]>([])
const loading = ref(false)
const uploading = ref(false)
const selectedMedia = ref<any>(null)
const searchQuery = ref('')

const uploadForm = reactive({
  file: null as File | null,
  alt: '',
  title: '',
})

async function loadMedia() {
  loading.value = true
  try {
    const data = await $fetch<{ items: any[] }>('/api/admin/media', { query: { limit: 50 } })
    mediaItems.value = data.items
  } finally {
    loading.value = false
  }
}

function open() {
  modal.value?.showModal()
  activeTab.value = 'library'
  selectedMedia.value = null
  loadMedia()
}

function close() {
  modal.value?.close()
  activeTab.value = 'library'
  uploadForm.file = null
  uploadForm.alt = ''
  uploadForm.title = ''
}

function selectMedia(item: any) {
  selectedMedia.value = item
}

function confirmSelection() {
  if (selectedMedia.value) {
    emit('select', selectedMedia.value)
    close()
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  uploadForm.file = target.files?.[0] || null
}

async function uploadFile() {
  if (!uploadForm.file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', uploadForm.file)
    fd.append('alt', uploadForm.alt)
    fd.append('title', uploadForm.title)
    await $fetch('/api/admin/media/upload', { method: 'POST', body: fd })
    uploadForm.file = null
    uploadForm.alt = ''
    uploadForm.title = ''
    activeTab.value = 'library'
    await loadMedia()
  } finally {
    uploading.value = false
  }
}

const filteredMedia = computed(() => {
  if (!searchQuery.value) return mediaItems.value
  const q = searchQuery.value.toLowerCase()
  return mediaItems.value.filter(
    (m) =>
      m.original_name?.toLowerCase().includes(q) ||
      m.alt?.toLowerCase().includes(q) ||
      m.filename?.toLowerCase().includes(q),
  )
})

defineExpose({ open })
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box max-w-4xl">
      <h3 class="mb-4 text-lg font-bold">Media Library</h3>

      <!-- Tabs -->
      <div class="tabs tabs-boxed mb-4">
        <a :class="['tab', { 'tab-active': activeTab === 'library' }]" @click="activeTab = 'library'">Library</a>
        <a :class="['tab', { 'tab-active': activeTab === 'upload' }]" @click="activeTab = 'upload'">Upload New</a>
      </div>

      <!-- Upload tab -->
      <div v-if="activeTab === 'upload'" class="space-y-4">
        <div>
          <label class="label"><span class="label-text">File (image, max 2MB)</span></label>
          <input type="file" accept="image/*" class="file-input file-input-bordered w-full" @change="handleFileSelect" />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiText label="Alt Text (SEO)" v-model="uploadForm.alt" />
          <AdminUiText label="Title" v-model="uploadForm.title" />
        </div>
        <button class="btn btn-primary" :disabled="!uploadForm.file || uploading" @click="uploadFile">
          <span v-if="uploading" class="loading loading-spinner" />
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>

      <!-- Library tab -->
      <div v-else class="space-y-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search media..."
          class="input input-bordered w-full"
        />

        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg" />
        </div>

        <div v-else-if="filteredMedia.length === 0" class="py-8 text-center text-base-content/60">
          No media found.
        </div>

        <div v-else class="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto md:grid-cols-4">
          <div
            v-for="item in filteredMedia"
            :key="item.id"
            :class="[
              'cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition-all hover:border-primary',
              selectedMedia?.id === item.id ? 'border-primary ring-2 ring-primary/30' : 'border-base-300',
            ]"
            @click="selectMedia(item)"
          >
            <img
              :src="`/api/admin/media/${item.id}/file`"
              :alt="item.alt || ''"
              class="aspect-square w-full rounded object-cover"
              loading="lazy"
            />
            <p class="mt-1 truncate px-1 text-xs">{{ item.original_name }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-action">
        <button class="btn" @click="close">Cancel</button>
        <button
          v-if="activeTab === 'library'"
          class="btn btn-primary"
          :disabled="!selectedMedia"
          @click="confirmSelection"
        >
          Select
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>