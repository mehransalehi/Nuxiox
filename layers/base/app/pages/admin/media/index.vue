<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: 'Media Library' }))

const toastStore = useToastStore()

const mediaItems = ref<any[]>([])
const totalItems = ref(0)
const page = ref(1)
const limit = ref(24)
const loading = ref(false)
const deleting = ref(false)
const selectedId = ref<number | null>(null)

const totalPages = computed(() => Math.ceil(totalItems.value / limit.value))

async function loadMedia() {
  loading.value = true
  try {
    const data = await $fetch<{ items: any[]; total?: number; page: number }>('/api/admin/media', {
      query: { page: page.value, limit: limit.value },
    })
    mediaItems.value = data.items
    totalItems.value = data.total ?? data.items.length
  } finally {
    loading.value = false
  }
}

async function deleteMedia(id: number) {
  if (!confirm('Delete this image?')) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    toastStore.push('Image deleted', 'success')
    await loadMedia()
  } catch {
    toastStore.push('Failed to delete', 'error')
  } finally {
    deleting.value = false
  }
}

function copyUrl(id: number) {
  const url = `${window.location.origin}/api/admin/media/${id}/file`
  navigator.clipboard.writeText(url)
  toastStore.push('URL copied to clipboard', 'success')
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(ts: number | string) {
  return new Date(ts).toLocaleDateString()
}

// Upload refs
const showUpload = ref(false)
const uploadForm = reactive({ file: null as File | null, alt: '', title: '' })
const uploading = ref(false)

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
    toastStore.push('Uploaded successfully', 'success')
    uploadForm.file = null
    uploadForm.alt = ''
    uploadForm.title = ''
    showUpload.value = false
    page.value = 1
    await loadMedia()
  } catch {
    toastStore.push('Upload failed', 'error')
  } finally {
    uploading.value = false
  }
}

onMounted(loadMedia)
</script>

<template>
  <AdminPage title="Media Library">
    <template #header>
      <button class="btn btn-primary" @click="showUpload = !showUpload">
        <i class="fa-solid fa-upload mr-1" /> Upload
      </button>
    </template>

    <!-- Upload panel -->
    <div v-if="showUpload" class="mb-6 rounded-lg border border-base-300 bg-base-200/50 p-4">
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="label"><span class="label-text">File</span></label>
          <input type="file" accept="image/*" class="file-input file-input-bordered w-full" @change="handleFileSelect" />
        </div>
        <AdminUiText label="Alt Text (SEO)" v-model="uploadForm.alt" />
        <AdminUiText label="Title" v-model="uploadForm.title" />
      </div>
      <button class="btn btn-primary mt-4" :disabled="!uploadForm.file || uploading" @click="uploadFile">
        <span v-if="uploading" class="loading loading-spinner" />
        {{ uploading ? 'Uploading...' : 'Upload' }}
      </button>
    </div>

    <!-- Media grid -->
    <div v-if="loading" class="flex justify-center py-16">
      <span class="loading loading-spinner loading-lg" />
    </div>

    <div v-else-if="mediaItems.length === 0" class="flex flex-col items-center gap-3 py-16 text-base-content/60">
      <i class="fa-solid fa-image text-5xl" />
      <p>No media yet. Upload your first image.</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="group relative overflow-hidden rounded-xl border border-base-300 bg-base-100 transition-all hover:shadow-lg"
        >
          <div class="aspect-square overflow-hidden bg-base-200">
            <img
              :src="`/api/admin/media/${item.id}/file`"
              :alt="item.alt || ''"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-2">
            <p class="truncate text-xs font-medium">{{ item.original_name }}</p>
            <p class="text-[10px] text-base-content/50">{{ formatBytes(item.size) }} · {{ formatDate(item.created_at) }}</p>
          </div>
          <!-- Hover overlay actions -->
          <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button class="btn btn-sm btn-square btn-ghost text-white" title="Copy URL" @click="copyUrl(item.id)">
              <i class="fa-solid fa-link" />
            </button>
            <button class="btn btn-sm btn-square btn-ghost text-white" title="Delete" @click="deleteMedia(item.id)">
              <i class="fa-solid fa-trash" />
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2">
        <button class="btn btn-sm" :disabled="page <= 1" @click="page--; loadMedia()">Previous</button>
        <span class="text-sm text-base-content/60">Page {{ page }} of {{ totalPages }}</span>
        <button class="btn btn-sm" :disabled="page >= totalPages" @click="page++; loadMedia()">Next</button>
      </div>
    </template>
  </AdminPage>
</template>