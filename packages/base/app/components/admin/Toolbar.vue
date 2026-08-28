<script setup lang="ts">
/**
 * AdminToolbar — Fixed top bar visible on public pages when an admin is logged in.
 * Provides quick access to admin dashboard + edit mode toggle for inline i18n editing.
 */
const editMode = useI18nEditMode()

const route = useRoute()
const { isAdmin, user, clear: clearSession } = useAdminSession()
const { settings } = useSiteSettings()

const showToolbar = computed(() => {
  if (route.path.startsWith('/admin')) return false
  return isAdmin.value
})

// Sidebar visibility
const showTextsSidebar = ref(false)
const showImagesSidebar = ref(false)

// Collect items when sidebar opens
const textItems = ref<{key:string;text:string}[]>([])
const imageItems = ref<{key:string;src:string}[]>([])

watch(showTextsSidebar, (v) => { if (v) textItems.value = editMode.collectTextItems() })
watch(showImagesSidebar, (v) => { if (v) imageItems.value = editMode.collectImageItems() })

function scrollToAndEdit(key: string) {
  editMode.scrollToElement(key)
  const el = document.querySelector<HTMLElement>(`[data-i18n="${key}"]`)
  if (el) {
    const rect = el.getBoundingClientRect()
    editMode.openEditor(key, rect.left, rect.bottom + 8)
  }
}

function scrollToAndHighlight(key: string) {
  editMode.scrollToElement(key)
}

function openImageEditor(key: string) {
  editMode.scrollToElement(key)
  editMode.editingImageKey = null
  nextTick(() => {
    editMode.editingImageKey = key
  })
}

// Link editing
const showLinksSidebar = ref(false)
const linkItems = ref<{key:string;href:string;text:string}[]>([])
const editingLinkUrl = ref("")

watch(showLinksSidebar, (v) => {
  if (v) {
    linkItems.value = editMode.collectLinkItems()
  }
})

function scrollToAndHighlightLink(key: string) {
  editMode.scrollToElement(key)
}

function openLinkEditor(key: string, currentHref: string) {
  editMode.scrollToElement(key)
  editingLinkUrl.value = currentHref
  editMode.editingLinkKey = key
}

async function saveLink() {
  const key = editMode.editingLinkKey
  if (!key) return
  await editMode.onLinkSaved(key, editingLinkUrl.value)
  editingLinkUrl.value = ""
  // Refresh the sidebar list
  linkItems.value = editMode.collectLinkItems()
}

// Media library modal for image editing
const mediaModal = ref<any>(null)

watch(() => editMode.editingImageKey, (key) => {
  if (key) {
    mediaModal.value?.open()
  }
})

function onMediaSelected(media: any) {
  editMode.onImageSelected(media)
}

async function handleLogout() {
  await clearSession()
  window.location.reload()
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Admin Toolbar -->
      <div
        v-if="showToolbar"
        class="admin-toolbar fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 border-b border-blue-300 bg-blue-600 px-4 py-1.5 text-xs text-white shadow-lg"
    >
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5 font-bold">
          <i class="fa-solid fa-shield-halved" />
          {{ settings?.seo?.siteName || 'Nuxiox' }}
        </span>
        <span class="opacity-50">|</span>
        <NuxtLink
          to="/admin"
          class="flex items-center gap-1 rounded px-2 py-0.5 transition-colors hover:bg-blue-500"
        >
          <i class="fa-solid fa-gauge" />
          Dashboard
        </NuxtLink>
        <NuxtLink
          :to="$localePath('/admin/i18n')"
          class="flex items-center gap-1 rounded px-2 py-0.5 transition-colors hover:bg-blue-500"
        >
          <i class="fa-solid fa-language" />
          Translations
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Edit mode toggle -->
        <button
          v-if="editMode"
          class="flex items-center gap-1.5 rounded px-2.5 py-1 font-semibold transition-all"
          :class="editMode.isEditMode ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' : 'bg-blue-500 text-white hover:bg-blue-400'"
          @click="editMode.toggleEditMode()"
        >
          <i class="fa-solid" :class="editMode.isEditMode ? 'fa-pen-to-square' : 'fa-pencil'" />
          {{ editMode.isEditMode ? 'Edit Mode ON' : 'Edit' }}
        </button>

        <!-- Sidebar buttons (only when edit mode is ON) -->
        <template v-if="editMode.isEditMode">
          <button
            class="flex items-center gap-1 rounded px-2 py-1 font-semibold transition-all"
            :class="showTextsSidebar ? 'bg-white text-blue-700' : 'bg-blue-500 text-white hover:bg-blue-400'"
            @click="showTextsSidebar = !showTextsSidebar"
          >
            <i class="fa-solid fa-font" />
            Texts
          </button>
          <button
            class="flex items-center gap-1 rounded px-2 py-1 font-semibold transition-all"
            :class="showImagesSidebar ? 'bg-white text-purple-700' : 'bg-purple-500 text-white hover:bg-purple-400'"
            @click="showImagesSidebar = !showImagesSidebar"
          >
            <i class="fa-solid fa-image" />
            Images
          </button>
          <button
            class="flex items-center gap-1 rounded px-2 py-1 font-semibold transition-all"
            :class="showLinksSidebar ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-400'"
            @click="showLinksSidebar = !showLinksSidebar"
          >
            <i class="fa-solid fa-link" />
            Links
          </button>
        </template>

        <span class="opacity-70">{{ user?.email }}</span>
        <button
          class="flex items-center gap-1 rounded px-2 py-0.5 transition-colors hover:bg-red-500"
          @click="handleLogout"
        >
          <i class="fa-solid fa-right-from-bracket" />
          Logout
        </button>
      </div>
    </div>

    <!-- Spacer when toolbar is visible (pushes page content down) -->
    <div v-if="showToolbar" class="h-9" />

    <!-- Inline edit popover -->
    <div
      v-if="editMode.editingKey && editMode.isEditMode"
      class="i18n-edit-popover fixed z-[10000] w-96 rounded-lg border border-blue-200 bg-white p-4 shadow-2xl"
      :style="{ left: editMode.editPosition.x + 'px', top: editMode.editPosition.y + 'px', maxWidth: 'calc(100vw - 32px)' }"
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-blue-600 truncate pr-2" :title="editMode.editingKey">
          {{ editMode.editingKey }}
        </span>
        <button class="text-gray-400 hover:text-gray-600" @click="editMode.closeEditor()">
          <i class="fa-solid fa-xmark" />
        </button>
      </div>
      <textarea
        v-model="editMode.editingValue"
        class="textarea textarea-bordered w-full text-sm"
        rows="2"
        @keydown.enter.ctrl="editMode.saveOverride()"
        @keydown.enter.meta="editMode.saveOverride()"
      />
      <div class="mt-2 flex items-center justify-between">
        <span class="text-[10px] text-gray-400">Ctrl+Enter to save</span>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-xs" @click="editMode.closeEditor()">Cancel</button>
          <button class="btn btn-primary btn-xs" @click="editMode.saveOverride()">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop click to close popover -->
    <div
      v-if="editMode.editingKey && editMode.isEditMode"
      class="i18n-edit-backdrop fixed inset-0 z-[9999]"
      @click="editMode.closeEditor()"
    />
    <!-- Media library picker for image editing -->
    <AdminMediaLibraryPicker ref="mediaModal" @select="onMediaSelected" />

    <!-- Texts sidebar panel -->
    <div
      v-if="showTextsSidebar && editMode.isEditMode"
      class="fixed top-0 right-0 z-[9999] h-full w-80 bg-white shadow-2xl border-l border-blue-200 overflow-y-auto"
    >
      <div class="sticky top-0 bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <span class="font-bold text-sm"><i class="fa-solid fa-font" /> Texts ({{ textItems.length }})</span>
        <button class="text-white/80 hover:text-white" @click="showTextsSidebar = false">
          <i class="fa-solid fa-xmark" />
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        <button
          v-for="item in textItems"
          :key="item.key"
          class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-xs"
          @click="scrollToAndEdit(item.key)"
        >
          <div class="font-mono font-bold text-blue-700 mb-0.5">{{ item.key }}</div>
          <div class="text-gray-500 truncate">{{ item.text || '(empty)' }}</div>
        </button>
        <div v-if="textItems.length === 0" class="px-4 py-8 text-center text-gray-400 text-xs">
          No text elements with data-i18n found on this page.
        </div>
      </div>
    </div>

    <!-- Images sidebar panel -->
    <div
      v-if="showImagesSidebar && editMode.isEditMode"
      class="fixed top-0 right-0 z-[9999] h-full w-80 bg-white shadow-2xl border-l border-purple-200 overflow-y-auto"
    >
      <div class="sticky top-0 bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
        <span class="font-bold text-sm"><i class="fa-solid fa-image" /> Images ({{ imageItems.length }})</span>
        <button class="text-white/80 hover:text-white" @click="showImagesSidebar = false">
          <i class="fa-solid fa-xmark" />
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="item in imageItems"
          :key="item.key"
          class="px-4 py-3 text-xs flex items-center gap-3 cursor-pointer hover:bg-purple-50 transition-colors"
          @click="scrollToAndHighlight(item.key)"
        >
          <img
            :src="item.src"
            class="w-12 h-12 rounded object-cover border border-gray-200 shrink-0"
            alt=""
            @error="($event.target as HTMLImageElement).style.display='none'"
          />
          <div class="min-w-0 flex-1">
            <div class="font-mono font-bold text-purple-700 mb-0.5 truncate">{{ item.key }}</div>
            <div class="text-gray-400 truncate">{{ item.src.split('/').pop() || item.src }}</div>
          </div>
          <button
            class="shrink-0 rounded bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors flex items-center gap-1"
            @click.stop="openImageEditor(item.key)"
          >
            <i class="fa-solid fa-pen-to-square" /> Edit
          </button>
        </div>
        <div v-if="imageItems.length === 0" class="px-4 py-8 text-center text-gray-400 text-xs">
          No images with data-nuxiox-img found on this page.
        </div>
      </div>
    </div>

    <!-- Links sidebar panel -->
    <div
      v-if="showLinksSidebar && editMode.isEditMode"
      class="fixed top-0 right-0 z-[9999] h-full w-80 bg-white shadow-2xl border-l border-emerald-200 overflow-y-auto"
    >
      <div class="sticky top-0 bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
        <span class="font-bold text-sm"><i class="fa-solid fa-link" /> Links ({{ linkItems.length }})</span>
        <button class="text-white/80 hover:text-white" @click="showLinksSidebar = false">
          <i class="fa-solid fa-xmark" />
        </button>
      </div>

      <!-- Inline link editor (shown when a link is selected) -->
      <div v-if="editMode.editingLinkKey" class="px-4 py-3 border-b border-emerald-100 bg-emerald-50">
        <div class="mb-2">
          <span class="text-xs font-mono font-bold text-emerald-700 truncate block">{{ editMode.editingLinkKey }}</span>
        </div>
        <input
          v-model="editingLinkUrl"
          type="url"
          class="input input-bordered input-sm w-full text-xs mb-2"
          placeholder="https://..."
          @keydown.enter="saveLink"
        />
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-xs" @click="editMode.editingLinkKey = null">Cancel</button>
          <button class="btn btn-primary btn-xs" @click="saveLink">
            <i class="fa-solid fa-check" /> Save
          </button>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <div
          v-for="item in linkItems"
          :key="item.key"
          class="px-4 py-3 text-xs flex items-center gap-3 cursor-pointer hover:bg-emerald-50 transition-colors"
          @click="scrollToAndHighlightLink(item.key)"
        >
          <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <i class="fa-solid fa-link"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-mono font-bold text-emerald-700 mb-0.5 truncate">{{ item.key }}</div>
            <div class="text-gray-400 truncate">{{ item.text || '(no text)' }}</div>
          </div>
          <button
            class="shrink-0 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors flex items-center gap-1"
            @click.stop="openLinkEditor(item.key, item.href)"
          >
            <i class="fa-solid fa-pen-to-square" /> Edit
          </button>
        </div>
        <div v-if="linkItems.length === 0" class="px-4 py-8 text-center text-gray-400 text-xs">
          No links with data-nuxiox-link found on this page.
        </div>
      </div>
    </div>
  </Teleport>
  </ClientOnly>
</template>

<style>
/* Ensure page content respects toolbar height */
.admin-toolbar + * {
  margin-top: 0;
}
</style>