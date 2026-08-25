<script setup lang="ts">
/**
 * Admin Custom Links
 *
 * Shows every link override the admin has set via inline edit mode
 * (stored under _links in the i18n_overrides setting). Each entry
 * can be edited via a text input or reset to the theme default.
 */
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: 'Custom Links' }))

const toastStore = useToastStore()
const loadingStore = useLoadingStore()

const { data: overrides, refresh } = await useAsyncData('custom-links', () =>
  $fetch<Record<string, any>>('/api/i18n').catch(() => ({})),
)

const linkOverrides = ref<Record<string, string>>({})
const editingKey = ref<string | null>(null)
const editingValue = ref('')

function syncFromServer() {
  linkOverrides.value = { ...((overrides.value?._links as Record<string, string>) ?? {}) }
}
watch(overrides, syncFromServer, { immediate: true })

const linkKeys = computed(() =>
  Object.entries(linkOverrides.value).sort(([a], [b]) => a.localeCompare(b)),
)

function startEdit(key: string, currentHref: string) {
  editingKey.value = key
  editingValue.value = currentHref
}

function cancelEdit() {
  editingKey.value = null
  editingValue.value = ''
}

async function saveEdit() {
  if (!editingKey.value) return
  linkOverrides.value[editingKey.value] = editingValue.value
  editingKey.value = null
  editingValue.value = ''
  await save()
}

async function resetLink(key: string) {
  delete linkOverrides.value[key]
  await save()
}

async function save() {
  loadingStore.startActionLoading()
  try {
    const body = {
      _links: linkOverrides.value,
      ...Object.fromEntries(
        Object.entries(overrides.value ?? {}).filter(([k]) => k !== '_links'),
      ),
    }
    await $fetch('/api/i18n', { method: 'PUT', body })
    toastStore.push('Links saved', 'success')
    await refresh()
  } catch (e: any) {
    toastStore.push(e?.message || 'Failed to save links', 'error')
  } finally {
    loadingStore.stopActionLoading()
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Custom Links</h1>
        <p class="text-sm opacity-60">Manage link overrides set via inline edit mode.</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm" @click="syncFromServer">
          Discard
        </button>
        <button class="btn btn-primary btn-sm" @click="save">
          Save
        </button>
      </div>
    </div>

    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div v-if="linkKeys.length === 0" class="py-16 text-center">
          <i class="fa-solid fa-link text-4xl opacity-30" />
          <p class="mt-4 opacity-70">No custom links yet. Edit a link on the site in edit mode and it will appear here.</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="[key, href] in linkKeys"
            :key="key"
            class="flex items-center gap-3 rounded-xl border border-base-300 p-3"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <i class="fa-solid fa-link"></i>
            </div>

            <!-- View mode -->
            <template v-if="editingKey !== key">
              <div class="min-w-0 flex-1">
                <div class="truncate font-mono text-xs font-bold" :title="key">{{ key }}</div>
                <div class="truncate text-xs opacity-50">{{ href }}</div>
              </div>
              <div class="flex shrink-0 flex-col gap-1">
                <button class="btn btn-primary btn-xs" @click="startEdit(key, href)">
                  <i class="fa-solid fa-pen-to-square" /> Edit
                </button>
                <button class="btn btn-ghost btn-xs text-error" @click="resetLink(key)">
                  <i class="fa-solid fa-rotate-left" /> Reset
                </button>
              </div>
            </template>

            <!-- Edit mode -->
            <template v-else>
              <div class="min-w-0 flex-1 space-y-1">
                <div class="truncate font-mono text-xs font-bold" :title="key">{{ key }}</div>
                <input
                  v-model="editingValue"
                  type="url"
                  class="input input-bordered input-sm w-full text-xs"
                  placeholder="https://..."
                  @keydown.enter="saveEdit"
                />
              </div>
              <div class="flex shrink-0 gap-1">
                <button class="btn btn-ghost btn-xs" @click="cancelEdit">
                  Cancel
                </button>
                <button class="btn btn-primary btn-xs" @click="saveEdit">
                  <i class="fa-solid fa-check" />
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>