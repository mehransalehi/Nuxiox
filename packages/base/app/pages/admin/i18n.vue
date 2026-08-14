<script setup lang="ts">
/**
 * Admin i18n Translation Editor
 *
 * Allows admins to view and edit all translation keys per locale.
 * Overrides are stored in the settings table and merged at runtime.
 */
import { flatten } from '~~/packages/base/utils/flatten'
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: 'Translation Editor' }))

const { t, locale: i18nLocale, locales } = useI18n()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const route = useRoute()
const router = useRouter()

const activeLocale = ref((route.query.locale as string) || 'en')
const searchQuery = ref('')
const saving = ref(false)

const localeOptions = computed(() =>
  locales.value.map((cur: any) => ({
    key: cur.name as string,
    value: cur.code as string,
  })),
)

// Fetch default (bundled) messages for current locale
const { data: defaultMessages, refresh: refreshDefaults, pending: loadingDefaults } = await useFetch<Record<string, any>>(
  () => `/api/i18n/defaults/${activeLocale.value}`,
  {
    watch: [activeLocale],
    immediate: true,
  },
)

// Fetch overrides from DB
const { data: overrides, refresh: refreshOverrides } = await useAsyncData('i18n-overrides', () =>
  $fetch<Record<string, any>>('/api/i18n').catch(() => ({})),
)

// Local editable form: key → override value (empty string = use default)
const form = ref<Record<string, string>>({})

// Flattened default keys (for reference)
const flatDefaults = computed<Record<string, string>>(() => {
  if (!defaultMessages.value) return {}
  return flatten(defaultMessages.value)
})

// All known keys sorted by section
type KeyEntry = { key: string; defaultValue: string; overrideValue: string; section: string }
const allKeys = computed<KeyEntry[]>(() => {
  const result: KeyEntry[] = []
  const overridesForLocale = overrides.value?.[activeLocale.value] ?? {}

  // Collect from default keys first
  for (const [key, value] of Object.entries(flatDefaults.value)) {
    const section = key.split('.')[0]
    result.push({
      key,
      defaultValue: value,
      overrideValue: overridesForLocale[key] ?? '',
      section,
    })
  }

  // Also include any override keys that aren't in defaults (in case of added keys)
  for (const [key, value] of Object.entries(overridesForLocale)) {
    if (!result.find((e) => e.key === key)) {
      const section = key.split('.')[0]
      result.push({
        key,
        defaultValue: '',
        overrideValue: value,
        section,
      })
    }
  }

  result.sort((a, b) => a.key.localeCompare(b.key))
  return result
})

// Grouped by section
const groupedKeys = computed(() => {
  const groups: Record<string, KeyEntry[]> = {}
  for (const entry of allKeys.value) {
    if (!groups[entry.section]) groups[entry.section] = []
    groups[entry.section].push(entry)
  }
  return groups
})

// Filtered by search
const filteredGroupedKeys = computed(() => {
  if (!searchQuery.value) return groupedKeys.value
  const q = searchQuery.value.toLowerCase()
  const result: Record<string, KeyEntry[]> = {}
  for (const [section, entries] of Object.entries(groupedKeys.value)) {
    const filtered = entries.filter(
      (e) =>
        e.key.toLowerCase().includes(q) ||
        e.defaultValue.toLowerCase().includes(q) ||
        e.overrideValue.toLowerCase().includes(q),
    )
    if (filtered.length > 0) result[section] = filtered
  }
  return result
})

// Collapsible sections
const expandedSections = ref<Set<string>>(new Set())

function toggleSection(section: string) {
  if (expandedSections.value.has(section)) {
    expandedSections.value.delete(section)
  } else {
    expandedSections.value.add(section)
  }
  // Trigger reactivity by creating a new Set
  expandedSections.value = new Set(expandedSections.value)
}

// When search is active, expand all matching sections
watch(searchQuery, (q) => {
  if (q) {
    expandedSections.value = new Set(Object.keys(filteredGroupedKeys.value))
  }
})

// Initialize form from overrides for current locale
function initForm() {
  if (!overrides.value) return
  const localeOverrides = overrides.value[activeLocale.value] ?? {}
  form.value = { ...localeOverrides }
}

watch(
  () => overrides.value,
  initForm,
  { immediate: true },
)

// Also update form when switching locale
watch(activeLocale, initForm)

// Reset a key to default
function resetKey(key: string) {
  delete form.value[key]
}

async function save() {
  saving.value = true
  try {
    const payload: Record<string, Record<string, string>> = {
      [activeLocale.value]: {},
    }

    // Build payload: keys with values different from defaults
    for (const entry of allKeys.value) {
      const overrideVal = form.value[entry.key]
      // Save override if it differs from default and is not empty
      if (overrideVal && overrideVal !== entry.defaultValue) {
        payload[activeLocale.value][entry.key] = overrideVal
      }
      // If override is explicitly emptied and was previously overridden
      if (!overrideVal && entry.overrideValue) {
        payload[activeLocale.value][entry.key] = ''
      }
    }

    await $fetch('/api/i18n', {
      method: 'PUT',
      body: payload,
    })

    toastStore.push('Translations saved successfully.', 'success')
    await refreshOverrides()
    await refreshDefaults()
  } catch (err) {
    toastStore.push(
      err instanceof Error ? err.message : 'Failed to save translations.',
      'error',
    )
  } finally {
    saving.value = false
  }
}

function switchLocale(locale: string) {
  activeLocale.value = locale
  router.replace({ query: { ...route.query, locale } })
}
</script>

<template>
  <AdminPage title="Translation Editor" subtitle="Edit locale translations per key.">
    <template #header>
      <div class="flex items-center gap-2">
        <select v-model="activeLocale" class="select select-bordered select-sm" @change="switchLocale(activeLocale)">
          <option v-for="opt in localeOptions" :key="opt.value" :value="opt.value">
            {{ opt.key }}
          </option>
        </select>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search translations..."
          class="input input-bordered input-sm w-64"
        />
        <button
          class="btn btn-primary btn-sm"
          :class="{ 'btn-disabled': saving }"
          @click="save"
        >
          <span v-if="saving" class="loading loading-spinner loading-xs" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </template>

    <AdminLoadingSpinner v-if="loadingDefaults && flatDefaults.length === 0" title="Loading translations..." />

    <div v-else-if="Object.keys(filteredGroupedKeys).length === 0" class="py-16 text-center opacity-60">
      <i class="fa-solid fa-language text-4xl mb-4" />
      <p>{{ searchQuery ? 'No translations match your search.' : 'No translation keys found.' }}</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(entries, section) in filteredGroupedKeys"
        :key="section"
        class="card bg-base-100 shadow overflow-hidden"
      >
        <button
          class="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold hover:bg-base-200 transition-colors cursor-pointer border-b border-base-200"
          @click="toggleSection(section)"
        >
          <span>{{ section }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-normal opacity-50">{{ entries.length }} keys</span>
            <i
              class="fa-solid transition-transform duration-200"
              :class="expandedSections.has(section) ? 'fa-chevron-up' : 'fa-chevron-down'"
            />
          </div>
        </button>

        <div v-if="expandedSections.has(section)" class="divide-y divide-base-200">
          <div
            v-for="entry in entries"
            :key="entry.key"
            :class="[
              'grid grid-cols-12 gap-3 px-4 py-3 text-sm items-start',
              entry.overrideValue ? 'bg-blue-50/50' : '',
            ]"
          >
            <!-- Key (dotted path) -->
            <div class="col-span-3">
              <code class="text-[11px] font-mono text-blue-700 break-all">{{ entry.key }}</code>
            </div>

            <!-- Default value (read-only) -->
            <div class="col-span-4">
              <div v-if="entry.defaultValue" class="text-gray-400 text-xs italic truncate" :title="entry.defaultValue">
                {{ entry.defaultValue }}
              </div>
              <div v-else class="text-gray-300 text-xs italic">(no default)</div>
            </div>

            <!-- Override value (editable) -->
            <div class="col-span-4">
              <input
                v-model="form[entry.key]"
                type="text"
                class="input input-bordered input-xs w-full"
                :class="{ 'border-blue-400': entry.overrideValue }"
                :placeholder="entry.defaultValue || 'Enter translation...'"
              />
            </div>

            <!-- Actions -->
            <div class="col-span-1 flex items-center gap-1">
              <button
                v-if="entry.overrideValue"
                class="btn btn-ghost btn-xs text-gray-400 hover:text-red-500"
                title="Reset to default"
                @click="resetKey(entry.key)"
              >
                <i class="fa-solid fa-undo" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-4">
        <p class="text-xs opacity-50">
          {{ allKeys.length }} keys • {{ Object.keys(form).filter(k => form[k]).length }} overridden
        </p>
      </div>
    </div>
  </AdminPage>
</template>