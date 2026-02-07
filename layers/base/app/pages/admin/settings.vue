<script setup lang="ts">
import { defaultSettings, type SiteSettings } from '~~/layers/base/utils/settings'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

const { data, pending, error, refresh } = await useFetch<SiteSettings>('/api/settings', {
  default: () => structuredClone(defaultSettings),
})

const form = reactive<SiteSettings>(structuredClone(defaultSettings))
const activeTab = ref<'general' | 'navbar' | 'footer'>('general')
const saving = ref(false)
const saveMessage = ref('')
const saveError = ref('')

watch(
  () => data.value,
  (value) => {
    if (!value) return
    form.general = structuredClone(value.general)
    form.navbar = structuredClone(value.navbar)
    form.footer = structuredClone(value.footer)
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

const saveSettings = async () => {
  saving.value = true
  saveMessage.value = ''
  saveError.value = ''
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: form,
    })
    saveMessage.value = 'Settings saved successfully.'
    await refresh()
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to save settings.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Settings</h2>
        <p class="opacity-70">Configure general layout, navbar, and footer settings.</p>
      </div>
      <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="saveSettings">
        <span v-if="saving" class="loading loading-spinner"></span>
        Save Settings
      </button>
    </div>

    <div v-if="saveMessage" class="alert alert-success">
      {{ saveMessage }}
    </div>
    <div v-if="saveError" class="alert alert-error">
      {{ saveError }}
    </div>

    <div class="tabs tabs-lifted">
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'general' }"
        @click="activeTab = 'general'"
      >
        General Settings
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'navbar' }"
        @click="activeTab = 'navbar'"
      >
        Navbar Settings
      </button>
      <button
        class="tab"
        :class="{ 'tab-active': activeTab === 'footer' }"
        @click="activeTab = 'footer'"
      >
        Footer Settings
      </button>
    </div>

    <div v-if="pending" class="flex items-center gap-2">
      <span class="loading loading-spinner"></span>
      <span>Loading settings...</span>
    </div>
    <div v-if="error" class="alert alert-error">Unable to load settings.</div>

    <section v-if="activeTab === 'general'" class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h3 class="card-title">General Settings</h3>
        <label class="flex items-center gap-4">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="form.general.showSidebar"
          />
          <span class="font-medium">Show main sidebar</span>
        </label>
      </div>
    </section>

    <section v-if="activeTab === 'navbar'" class="card bg-base-100 shadow">
      <div class="card-body space-y-6">
        <div>
          <h3 class="card-title">Navbar Settings</h3>
          <p class="text-sm opacity-70">Manage menu items, logos, and info links.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">Light logo URL</span>
            <input v-model="form.navbar.lightLogo" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">Dark logo URL</span>
            <input v-model="form.navbar.darkLogo" class="input input-bordered" type="text" />
          </label>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">Menus</h4>
            <button class="btn btn-sm" @click="addNavbarMenu">Add menu</button>
          </div>
          <div v-for="(menu, index) in form.navbar.menus" :key="`navbar-menu-${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="menu.label" class="input input-bordered" type="text" placeholder="Label" />
            <input v-model="menu.href" class="input input-bordered" type="text" placeholder="/path" />
            <button class="btn btn-ghost btn-square" @click="removeNavbarMenu(index)">✕</button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">Info list</h4>
            <button class="btn btn-sm" @click="addNavbarInfo">Add info</button>
          </div>
          <div v-for="(info, index) in form.navbar.info" :key="`navbar-info-${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="info.key" class="input input-bordered" type="text" placeholder="Label" />
            <input v-model="info.value" class="input input-bordered" type="text" placeholder="Value or URL" />
            <button class="btn btn-ghost btn-square" @click="removeNavbarInfo(index)">✕</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'footer'" class="card bg-base-100 shadow">
      <div class="card-body space-y-6">
        <div>
          <h3 class="card-title">Footer Settings</h3>
          <p class="text-sm opacity-70">Manage footer menus, logos, and info links.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text">Light logo URL</span>
            <input v-model="form.footer.lightLogo" class="input input-bordered" type="text" />
          </label>
          <label class="form-control">
            <span class="label-text">Dark logo URL</span>
            <input v-model="form.footer.darkLogo" class="input input-bordered" type="text" />
          </label>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">Menus</h4>
            <button class="btn btn-sm" @click="addFooterMenu">Add menu</button>
          </div>
          <div v-for="(menu, index) in form.footer.menus" :key="`footer-menu-${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="menu.label" class="input input-bordered" type="text" placeholder="Label" />
            <input v-model="menu.href" class="input input-bordered" type="text" placeholder="/path" />
            <button class="btn btn-ghost btn-square" @click="removeFooterMenu(index)">✕</button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-semibold">Info list</h4>
            <button class="btn btn-sm" @click="addFooterInfo">Add info</button>
          </div>
          <div v-for="(info, index) in form.footer.info" :key="`footer-info-${index}`" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input v-model="info.key" class="input input-bordered" type="text" placeholder="Label" />
            <input v-model="info.value" class="input input-bordered" type="text" placeholder="Value or URL" />
            <button class="btn btn-ghost btn-square" @click="removeFooterInfo(index)">✕</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
