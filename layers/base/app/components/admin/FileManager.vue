<!-- components/admin/FileManager.vue -->
<template>
  <div>
    <button @click="openModal" class="btn btn-primary">
      <i class="fa fa-image mr-2"></i>
      {{ selectedMedia ? 'Change Image' : 'Select Image' }}
    </button>

    <div v-if="selectedMedia" class="mt-2">
      <img :src="`/api/admin/media/${selectedMedia.id}/file`" :alt="selectedMedia.alt || ''" class="w-32 h-32 object-cover rounded" />
      <button @click="clearSelection" class="btn btn-sm btn-ghost mt-1">Remove</button>
    </div>

    <dialog ref="modal" class="modal">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">Media Library</h3>

        <div class="tabs tabs-boxed mb-4">
          <a :class="['tab', { 'tab-active': activeTab === 'library' }]" @click="activeTab = 'library'">Library</a>
          <a :class="['tab', { 'tab-active': activeTab === 'upload' }]" @click="activeTab = 'upload'">Upload</a>
        </div>

        <div v-if="activeTab === 'upload'" class="space-y-4">
          <input type="file" @change="handleFileSelect" accept="image/*" class="file-input file-input-bordered w-full" />
          
          <div class="form-control">
            <label class="label"><span class="label-text">Alt Text (SEO)</span></label>
            <input v-model="uploadForm.alt" type="text" class="input input-bordered" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Title</span></label>
            <input v-model="uploadForm.title" type="text" class="input input-bordered" />
          </div>

          <button @click="uploadFile" :disabled="!uploadForm.file || uploading" class="btn btn-primary">
            <span v-if="uploading" class="loading loading-spinner"></span>
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <div v-if="loading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            <div
              v-for="item in mediaItems"
              :key="item.id"
              @click="selectMedia(item)"
              :class="['cursor-pointer border-2 rounded-lg p-2 hover:border-primary', { 'border-primary': selectedMedia?.id === item.id }]"
            >
              <img :src="`/api/admin/media/${item.id}/file`" :alt="item.alt || ''" class="w-full h-32 object-cover rounded" />
              <p class="text-xs mt-1 truncate">{{ item.originalName }}</p>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button @click="closeModal" class="btn">Cancel</button>
          <button v-if="activeTab === 'library'" @click="confirmSelection" :disabled="!selectedMedia" class="btn btn-primary">Select</button>
        </div>
      </div><form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'update:media': [media: any]
}>()

const modal = ref<HTMLDialogElement>()
const activeTab = ref<'library' | 'upload'>('library')
const mediaItems = ref<any[]>([])
const selectedMedia = ref<any>(null)
const loading = ref(false)
const uploading = ref(false)

const uploadForm = ref({
  file: null as File | null,
  alt: '',
  title: ''
})

async function loadMedia() {
  loading.value = true
  try {
    const data = await $fetch('/api/admin/media')
    mediaItems.value = data.items
    
    if (props.modelValue) {
      selectedMedia.value = mediaItems.value.find(m => m.id === props.modelValue)
    }
  } finally {
    loading.value = false
  }
}

function openModal() {
  modal.value?.showModal()
  loadMedia()
}

function closeModal() {
  modal.value?.close()
  activeTab.value = 'library'
  uploadForm.value = { file: null, alt: '', title: '' }
}

function selectMedia(item: any) {
  selectedMedia.value = item
}

function confirmSelection() {
  if (selectedMedia.value) {
    emit('update:modelValue', selectedMedia.value.id)
    emit('update:media', selectedMedia.value)
    closeModal()
  }
}

function clearSelection() {
  selectedMedia.value = null
  emit('update:modelValue', null)
  emit('update:media', null)
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  uploadForm.value.file = target.files?.[0] || null
}

async function uploadFile() {
  if (!uploadForm.value.file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('alt', uploadForm.value.alt)
    formData.append('title', uploadForm.value.title)

    const uploaded = await $fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData
    })

    selectedMedia.value = uploaded
    emit('update:modelValue', uploaded.id)
    emit('update:media', uploaded)
    
    activeTab.value = 'library'
    await loadMedia()
    uploadForm.value = { file: null, alt: '', title: '' }
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  if (props.modelValue) {
    loadMedia()
  }
})
</script>
