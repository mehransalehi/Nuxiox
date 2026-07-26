<script setup lang="ts">
import { defaultSettings, type SiteSettings } from '~~/packages/base/utils/settings'
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.sidebar.settings') }))
const { locale } = useI18n()

const { data, pending, error, refresh } = await useFetch<SiteSettings>('/api/settings', {
  default: () => structuredClone(defaultSettings),
})
const { setLocale } = useI18n()

const form = reactive<SiteSettings>(structuredClone(defaultSettings))
form.general.language = locale.value;
const activeTab = ref<'general' | 'navbar' | 'footer' | 'blog' | 'seo' | 'theme' | 'about'>('general')
const saving = ref(false)
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const currentLocal = ref(locale.value)
const imageNumber = ref(0)

const defaultTheme = structuredClone(defaultSettings.theme)
const resetTheme = () => {
  form.theme = structuredClone(defaultTheme)
}


watch(
  () => data.value,
  (value) => {
    if (!value) return
    form.general = structuredClone(value.general)
    form.navbar = structuredClone(value.navbar)
    form.footer = structuredClone(value.footer)
    form.blog = structuredClone(value.blog)
    form.seo = structuredClone(value.seo)
    form.theme = structuredClone(value.theme)
    form.about = structuredClone(value.about)
  },
  { immediate: true }
)

const updateNavbarMenu = (menu: typeof form.navbar.menus) => {
  form.navbar.menus = menu
}

const updateNavbarInfo = (list: typeof form.navbar.info) => {
  form.navbar.info = list
}


const updateFooterMenu = (menu: typeof form.navbar.menus) => {
  form.footer.menus = menu
}

const updateFooterInfo = (list: typeof form.navbar.info) => {
  form.footer.info = list
}
const updateAboutInfo = (list: typeof form.navbar.info) => {
  form.about.info = list
}
const saveSettings = async () => {
  saving.value = true
  setLocale(currentLocal.value)
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch('/api/settings', {
        method: 'PUT',
        body: form,
      })
      toastStore.push($t('admin.settings.settingsSaved'), 'success')
      await refresh()
    } catch (err) {
      toastStore.push(err instanceof Error ? err.message : $t('admin.settings.settingsFailed'), 'error')
    } finally {
      saving.value = false
    }
  })
}

function handleMediaUpdate(media:any) {
  if (media) {
    form.navbar.lightLogo = `/api/admin/media/${media.id}/file`
  }
}
</script>

<template>

  <AdminPage :title="$t('admin.settings.title')" :subtitle="$t('admin.settings.description')">
    <template #header>
      <button class="btn btn-primary" :class="{ 'btn-disabled': saving }" @click="saveSettings">
        <span v-if="saving" class="loading loading-spinner"></span>
        {{ $t('common.saveSettings') }}
      </button>
    </template>
    <div class="tabs tabs-boxed border border-base-300 bg-base-100 p-1">
      <button class="tab" :class="{ 'tab-active': activeTab === 'general' }" @click="activeTab = 'general'">
        {{ $t('admin.settings.generalTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'navbar' }" @click="activeTab = 'navbar'">
        {{ $t('admin.settings.navbarTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'footer' }" @click="activeTab = 'footer'">
        {{ $t('admin.settings.footerTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'blog' }" @click="activeTab = 'blog'">
        {{ $t('admin.settings.blogTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'seo' }" @click="activeTab = 'seo'">{{
        $t('admin.settings.seoTab') }}</button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'theme' }" @click="activeTab = 'theme'">{{
        $t('admin.settings.themeTab') }}</button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'about' }" @click="activeTab = 'about'">{{
        $t('admin.settings.aboutTab') }}</button>
    </div>
    <AdminLoadingSpinner v-if="pending" :title="$t('common.loadingSettings')" />
    <AdminUiError v-if="error" :message="$t('common.unableToLoadSettings')" />

    <AdminCard v-if="activeTab === 'general'" :title="$t('admin.settings.generalTitle')">
      <AdminUiCheckBox :label="$t('admin.settings.showSidebar')" v-model="form.general.showSidebar" />
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiSelect :label="$t('admin.settings.direction')" v-model="form.general.direction"
          :options="[{ key: $t('admin.settings.directionLtr'), value: 'ltr' }, { key: $t('admin.settings.directionRtl'), value: 'rtl' }]" />
        <AdminLocaleSelector :label="$t('admin.settings.language')" v-model="currentLocal" />
      </div>
    </AdminCard>

    <AdminCard v-if="activeTab === 'navbar'" :title="$t('admin.settings.navbarTitle')"
      :subtitle="$t('admin.settings.navbarDescription')">
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('common.lightLogoUrl')" v-model="form.navbar.lightLogo" />
        <!-- <AdminFileManager v-model="imageNumber" @update:media="handleMediaUpdate" /> -->
        <AdminUiText :label="$t('common.darkLogoUrl')" v-model="form.navbar.darkLogo" />
      </div>
      <AdminMenuCreator @update="updateNavbarMenu" :list="form.navbar.menus" handler="navbar" />
      <AdminListCreator @update="updateNavbarInfo" :list="form.navbar.info" />
    </AdminCard>


    <AdminCard v-if="activeTab === 'footer'" :title="$t('admin.settings.footerTitle')"
      :subtitle="$t('admin.settings.footerDescription')">
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('common.lightLogoUrl')" v-model="form.footer.lightLogo" />
        <AdminUiText :label="$t('common.darkLogoUrl')" v-model="form.footer.darkLogo" />
      </div>
      <AdminMenuCreator @update="updateFooterMenu" :list="form.footer.menus" handler="footer" />
      <AdminListCreator @update="updateFooterInfo" :list="form.footer.info" />
    </AdminCard>


    <AdminCard v-if="activeTab === 'blog'" :title="$t('admin.settings.blogCommentsTitle')">
      <AdminUiCheckBox :label="$t('admin.settings.commentsEnabled')" v-model="form.blog.commentsEnabled" />
      <AdminUiCheckBox :label="$t('admin.settings.commentsRequireApproval')"
        v-model="form.blog.commentsRequireApproval" />
      <AdminUiCheckBox :label="$t('admin.settings.allowAnonymousComments')"
        v-model="form.blog.allowAnonymousCommentsByDefault" />
      <AdminUiText :label="$t('common.recaptchaSiteKey')" v-model="form.blog.recaptchaSiteKey" />
      <AdminUiText :label="$t('common.recaptchaSecretKey')" v-model="form.blog.recaptchaSecretKey" />
    </AdminCard>


    <AdminCard v-if="activeTab === 'seo'" :title="$t('admin.settings.seoTitle')">
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('admin.settings.siteName')" v-model="form.seo.siteName" />
        <AdminUiUrl :label="$t('admin.settings.siteUrl')" v-model="form.seo.siteUrl" />
        <AdminUiText :label="$t('admin.settings.defaultTitle')" v-model="form.seo.defaultTitle" />
        <AdminUiText :label="$t('admin.settings.titleSuffix')" v-model="form.seo.titleSuffix" />
        <AdminUiTextarea :label="$t('admin.settings.defaultDescription')" v-model="form.seo.defaultDescription" />
        <AdminUiUrl :label="$t('admin.settings.defaultOgImage')" v-model="form.seo.defaultOgImage" />
        <AdminUiText :label="$t('admin.settings.robotsPolicy')" v-model="form.seo.robots" />
        <AdminUiText :label="$t('admin.settings.twitterHandle')" v-model="form.seo.twitterHandle" />
        <AdminUiText :label="$t('admin.settings.googleVerification')" v-model="form.seo.googleSiteVerification" />
        <AdminUiText :label="$t('admin.settings.bingVerification')" v-model="form.seo.bingSiteVerification" />
        <AdminUiText :label="$t('admin.settings.yandexVerification')" v-model="form.seo.yandexVerification" />
      </div>
    </AdminCard>

    <AdminCard v-if="activeTab === 'theme'" :title="$t('admin.settings.themeTitle')">
      <AdminUiSelect :label="$t('admin.settings.themePreset')" v-model="form.theme.preset" :options="[{ key: 'light', value: 'light' },
      { key: 'dark', value: 'dark' },
      { key: 'winter', value: 'winter' },
      { key: 'cupcake', value: 'cupcake' },
      { key: 'dracula', value: 'dracula' },
      ]" />
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <h4 class="font-semibold mb-2">{{ $t('admin.settings.lightPalette') }}</h4>
          <label class="form-control"><span class="label-text">Primary</span><input v-model="form.theme.light.primary"
              type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Secondary</span><input
              v-model="form.theme.light.secondary" type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Accent</span><input v-model="form.theme.light.accent"
              type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Neutral</span><input v-model="form.theme.light.neutral"
              type="color" class="input input-bordered h-10" /></label>
        </div>
        <div>
          <h4 class="font-semibold mb-2">{{ $t('admin.settings.darkPalette') }}</h4>
          <label class="form-control"><span class="label-text">Primary</span><input v-model="form.theme.dark.primary"
              type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Secondary</span><input
              v-model="form.theme.dark.secondary" type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Accent</span><input v-model="form.theme.dark.accent"
              type="color" class="input input-bordered h-10" /></label>
          <label class="form-control"><span class="label-text">Neutral</span><input v-model="form.theme.dark.neutral"
              type="color" class="input input-bordered h-10" /></label>
        </div>
      </div>
      <button class="btn" @click="resetTheme">{{ $t('admin.settings.resetTheme') }}</button>
    </AdminCard>

    <AdminCard v-if="activeTab === 'about'" :title="$t('admin.settings.aboutTitle')">
      <AdminListCreator @update="updateAboutInfo" :list="form.about.info" />
    </AdminCard>
  </AdminPage>
</template>
