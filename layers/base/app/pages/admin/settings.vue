<script setup lang="ts">
import { defaultSettings, type SiteSettings } from '~~/layers/base/utils/settings'
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

const { data, pending, error, refresh } = await useFetch<SiteSettings>('/api/settings', {
  default: () => structuredClone(defaultSettings),
})

const form = reactive<SiteSettings>(structuredClone(defaultSettings))
const activeTab = ref<'general' | 'navbar' | 'footer' | 'blog'>('general')
const saving = ref(false)
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const draggingMenu = ref<{ section: 'navbar' | 'footer'; index: number } | null>(null)
const { t } = useI18n()

watch(
  () => data.value,
  (value) => {
    if (!value) return
    form.general = structuredClone(value.general)
    form.navbar = structuredClone(value.navbar)
    form.footer = structuredClone(value.footer)
    form.blog = structuredClone(value.blog)
  },
  { immediate: true }
)

const addNavbarMenu = () => form.navbar.menus.push({ label: '', href: '' })
const removeNavbarMenu = (index: number) => form.navbar.menus.splice(index, 1)

const addNavbarInfo = () => form.navbar.info.push({ key: '', value: '' })
const removeNavbarInfo = (index: number) => form.navbar.info.splice(index, 1)

const addFooterMenu = () => form.footer.menus.push({ label: '', href: '' })
const removeFooterMenu = (index: number) => form.footer.menus.splice(index, 1)

const addFooterInfo = () => form.footer.info.push({ key: '', value: '' })
const removeFooterInfo = (index: number) => form.footer.info.splice(index, 1)

const reorderMenus = (section: 'navbar' | 'footer', fromIndex: number, toIndex: number) => {
  const menus = form[section].menus
  const [moved] = menus.splice(fromIndex, 1)
  if (moved)
    menus.splice(toIndex, 0, moved)
}

const handleDragStart = (section: 'navbar' | 'footer', index: number) => {
  draggingMenu.value = { section, index }
}

const resetDrag = () => {
  draggingMenu.value = null
}

const handleDrop = (section: 'navbar' | 'footer', index: number) => {
  if (!draggingMenu.value) return
  if (draggingMenu.value.section !== section) return
  const fromIndex = draggingMenu.value.index
  const toIndex = index
  if (fromIndex !== toIndex) {
    reorderMenus(section, fromIndex, toIndex)
  }
  draggingMenu.value = null
}

const saveSettings = async () => {
  saving.value = true
  await loadingStore.withActionLoading(async () => {
    try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: form,
    })
    toastStore.push(t('admin.settings.settingsSaved'), 'success')
    await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : t('admin.settings.settingsFailed'), 'error')
    } finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">{{ t('admin.settings.title') }}</h2>
        <p class="opacity-70">{{ t('admin.settings.description') }}</p>
      </div>
      <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="saveSettings">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ t('common.saveSettings') }}
      </button>
    </div>

    <div class="tabs tabs-boxed border border-base-300 bg-base-100 p-1">
      <button class="tab" :class="{ 'tab-active': activeTab === 'general' }" @click="activeTab = 'general'">
        {{ t('admin.settings.generalTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'navbar' }" @click="activeTab = 'navbar'">
        {{ t('admin.settings.navbarTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'footer' }" @click="activeTab = 'footer'">
        {{ t('admin.settings.footerTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'blog' }" @click="activeTab = 'blog'">
        Blog
      </button>
    </div>

    <div v-if="pending" class="flex items-center gap-2">
      <span class="loading loading-spinner"></span>
      <span>{{ t('common.loadingSettings') }}</span>
    </div>
    <div v-if="error" class="alert alert-error">{{ t('common.unableToLoadSettings') }}</div>

    <section v-if="activeTab === 'general'" class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h3 class="card-title">{{ t('admin.settings.generalTitle') }}</h3>
        <label class="flex items-center gap-4">
          <input type="checkbox" class="toggle toggle-primary" v-model="form.general.showSidebar" />
          <span class="font-medium">{{ t('admin.settings.showSidebar') }}</span>
        </label>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">{{ t('admin.settings.direction') }}</span>
            <select v-model="form.general.direction" class="select select-bordered">
              <option value="ltr">{{ t('admin.settings.directionLtr') }}</option>
              <option value="rtl">{{ t('admin.settings.directionRtl') }}</option>
            </select>
          </label>
          <label class="form-control">
            <span class="label-text">{{ t('admin.settings.language') }}</span>
            <select v-model="form.general.language" class="select select-bordered">
              <option value="en">{{ t('languages.english') }}</option>
              <option value="fa">{{ t('languages.persian') }}</option>
            </select>
          </label>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'navbar'" class="card bg-base-100 shadow">
      <div class="card-body space-y-6">
        <div>
          <h3 class="card-title">{{ t('admin.settings.navbarTitle') }}</h3>
          <p class="text-sm opacity-70">{{ t('admin.settings.navbarDescription') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">{{ t('common.lightLogoUrl') }}</span>
            <input v-model="form.navbar.lightLogo" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">{{ t('common.darkLogoUrl') }}</span>
            <input v-model="form.navbar.darkLogo" class="input input-bordered" type="text" />
          </label>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">{{ t('common.menus') }}</h4>
            <button class="btn btn-sm" @click="addNavbarMenu">{{ t('common.addMenu') }}</button>
          </div>
          <div v-for="(menu, index) in form.navbar.menus" :key="`navbar-menu-${index}`"
            class="grid gap-3 md:grid-cols-[auto_1fr_1fr_auto]" draggable="true"
            @dragstart="handleDragStart('navbar', index)" @dragend="resetDrag" @dragover.prevent
            @drop="handleDrop('navbar', index)">
            <button class="btn btn-ghost btn-square cursor-grab" type="button"
              :aria-label="t('common.dragToReorder') as any">
              <i class="fa-solid fa-grip-vertical" aria-hidden="true" />
            </button>
            <input v-model="menu.label" class="input input-bordered" type="text"
              :placeholder="t('common.label') as any" />
            <input v-model="menu.href" class="input input-bordered" type="text"
              :placeholder="t('common.pathPlaceholder') as any" />
            <button class="btn btn-ghost btn-square" @click="removeNavbarMenu(index)">✕</button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">{{ t('common.infoList') }}</h4>
            <button class="btn btn-sm" @click="addNavbarInfo">{{ t('common.addInfo') }}</button>
          </div>
          <div v-for="(info, index) in form.navbar.info" :key="`navbar-info-${index}`"
            class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="info.key" class="input input-bordered" type="text"
              :placeholder="t('common.label') as any" />
            <input v-model="info.value" class="input input-bordered" type="text"
              :placeholder="t('common.valueOrUrl') as any" />
            <button class="btn btn-ghost btn-square" @click="removeNavbarInfo(index)">✕</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'footer'" class="card bg-base-100 shadow">
      <div class="card-body space-y-6">
        <div>
          <h3 class="card-title">{{ t('admin.settings.footerTitle') }}</h3>
          <p class="text-sm opacity-70">{{ t('admin.settings.footerDescription') }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">{{ t('common.lightLogoUrl') }}</span>
            <input v-model="form.footer.lightLogo" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">{{ t('common.darkLogoUrl') }}</span>
            <input v-model="form.footer.darkLogo" class="input input-bordered" type="text" />
          </label>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">{{ t('common.menus') }}</h4>
            <button class="btn btn-sm" @click="addFooterMenu">{{ t('common.addMenu') }}</button>
          </div>
          <div v-for="(menu, index) in form.footer.menus" :key="`footer-menu-${index}`"
            class="grid gap-3 md:grid-cols-[auto_1fr_1fr_auto]" draggable="true"
            @dragstart="handleDragStart('footer', index)" @dragend="resetDrag" @dragover.prevent
            @drop="handleDrop('footer', index)">
            <button class="btn btn-ghost btn-square cursor-grab" type="button"
              :aria-label="t('common.dragToReorder') as any">
              <i class="fa-solid fa-grip-vertical" aria-hidden="true" />
            </button>
            <input v-model="menu.label" class="input input-bordered" type="text"
              :placeholder="t('common.label') as any" />
            <input v-model="menu.href" class="input input-bordered" type="text"
              :placeholder="t('common.pathPlaceholder') as any" />
            <button class="btn btn-ghost btn-square" @click="removeFooterMenu(index)">✕</button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">{{ t('common.infoList') }}</h4>
            <button class="btn btn-sm" @click="addFooterInfo">{{ t('common.addInfo') }}</button>
          </div>
          <div v-for="(info, index) in form.footer.info" :key="`footer-info-${index}`"
            class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="info.key" class="input input-bordered" type="text"
              :placeholder="t('common.label') as any" />
            <input v-model="info.value" class="input input-bordered" type="text"
              :placeholder="t('common.valueOrUrl') as any" />
            <button class="btn btn-ghost btn-square" @click="removeFooterInfo(index)">✕</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'blog'" class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h3 class="card-title">Blog & Comments</h3>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="form.blog.commentsEnabled" type="checkbox" class="toggle" />
          <span class="label-text">Enable comments globally</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="form.blog.commentsRequireApproval" type="checkbox" class="toggle" />
          <span class="label-text">Require admin approval before publish</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="form.blog.allowAnonymousCommentsByDefault" type="checkbox" class="toggle" />
          <span class="label-text">Allow guest comments by default</span>
        </label>
        <label class="form-control">
          <span class="label-text">reCAPTCHA site key</span>
          <input v-model="form.blog.recaptchaSiteKey" class="input input-bordered" type="text" />
        </label>
        <label class="form-control">
          <span class="label-text">reCAPTCHA secret key</span>
          <input v-model="form.blog.recaptchaSecretKey" class="input input-bordered" type="password" />
        </label>
      </div>
    </section>

  </div>
</template>
