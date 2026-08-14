<script setup lang="ts">
/**
 * Admin Custom Images
 *
 * Shows every image override the admin has set via inline edit mode
 * (stored under `_images` in the i18n_overrides setting). Each entry
 * can be replaced via the media library or reset to the theme default.
 */
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: 'Custom Images' }))

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

// All overrides from DB (includes _images + per-locale text overrides)
const { data: overrides, refresh } = await useAsyncData('custom-images', () =>
  $fetch<Record<string, any>>('/api/i18n').catch(() => ({})),
)

// Local copy of image overrides for editing
const imageOverrides = ref<Record<string, string>>({})

// Which key is currently being replaced via the picker
const editingKey = ref<string | null>(null)
const mediaModal = ref<any>(null)

// Hydrate local copy from server data
function syncFromServer() {
  imageOverrides.value = { ...((overrides.value?._images as Record<string, string>) ?? {}) }
}
watch(overrides, syncFromServer, { immediate: true })

const imageKeys = computed(() =>
  Object.entries(imageOverrides.value).sort(([a], [b]) => a.localeCompare(b)),
)

function openPicker(key: string) {
  editingKey.value = key
  nextTick(() => mediaModal.value?.open())
}

function onMediaSelected(media: any) {
  if (!editingKey.value) return
  const url = `/api/admin/media/${media.id}/file`
  imageOverrides.value[editingKey.value] = url
  editingKey.value = null
}

async function resetImage(key: string) {
  delete imageOverrides.value[key]
  await save()
}

async function save() {
  loadingStore.startActionLoading()
  try {
    const body = {
      _images: imageOverrides.value,
      // Keep existing per-locale text overrides untouched by re-sending them
      ...Object.fromEntries(
        Object.entries(overrides.value ?? {}).filter(([k]) => k !== '_images'),
      ),
    }
    await $fetch('/api/i18n', { method: 'PUT', body })
    toastStore.push('Images saved', 'success')
    await refresh()
  } catch (e: any) {
    toastStore.push(e?.message || 'Failed to save images', 'error')
  } finally {
    loadingStore.stopActionLoading()
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ $t('admin.customImages.title') }}</h1>
        <p class="text-sm opacity-60">{{ $t('admin.customImages.subtitle') }}</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm" @click="syncFromServer">
          {{ $t('admin.customImages.discard') }}
        </button>
        <button class="btn btn-primary btn-sm" @click="save">
          {{ $t('admin.customImages.save') }}
        </button>
      </div>
    </div>

    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div v-if="imageKeys.length === 0" class="py-16 text-center">
          <i class="fa-solid fa-image text-4xl opacity-30" />
          <p class="mt-4 opacity-70">{{ $t('admin.customImages.empty') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="[key, url] in imageKeys"
            :key="key"
            class="flex items-center gap-3 rounded-xl border border-base-300 p-3"
          >
            <img
              :src="url"
              :alt="key"
              class="h-16 w-16 shrink-0 rounded-lg border border-base-300 object-cover"
              loading="lazy"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
            <div class="min-w-0 flex-1">
              <div class="truncate font-mono text-xs font-bold" :title="key">{{ key }}</div>
              <div class="truncate text-xs opacity-50">{{ url.split('/').pop() }}</div>
            </div>
            <div class="flex shrink-0 flex-col gap-1">
              <button
                class="btn btn-primary btn-xs"
                @click="openPicker(key)"
              >
                <i class="fa-solid fa-pen-to-square" /> {{ $t('admin.customImages.change') }}
              </button>
              <button class="btn btn-ghost btn-xs text-error" @click="resetImage(key)">
                <i class="fa-solid fa-rotate-left" /> {{ $t('admin.customImages.reset') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdminMediaLibraryPicker ref="mediaModal" @select="onMediaSelected" />
  </div>
</template>
