<script setup lang="ts">
import { defaultSettings, type SiteSettings } from '~~/packages/base/utils/settings'
import { useToastStore } from '~~/packages/base/app/stores/toast'
import { useLoadingStore } from '~~/packages/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.sidebar.settings') }))

const { locale: i18nLocale, locales } = useI18n()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

// Which locale's per-language data is being edited
const editingLocale = ref(i18nLocale.value)

const localeOptions = computed(() =>
  locales.value.map((cur: any) => ({
    key: cur.name as string,
    value: cur.code as string,
  }))
)

const { data, pending, error, refresh } = await useFetch<SiteSettings>('/api/settings', {
  query: computed(() => ({ locale: editingLocale.value })),
  default: () => structuredClone(defaultSettings),
  watch: [editingLocale],
  immediate: true,
})

const form = reactive<SiteSettings>(structuredClone(defaultSettings))
const activeTab = ref<'general' | 'navbar' | 'footer' | 'blog' | 'seo' | 'theme' | 'about'>('general')
const saving = ref(false)

const defaultTheme = structuredClone(defaultSettings.theme)
const resetTheme = () => {
  form.theme = structuredClone(defaultTheme)
}

// When API data arrives, merge into form
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

// Switching locale is handled by the watcher on editingLocale via useFetch
const switchLocale = async (locale: string) => {
  editingLocale.value = locale
}

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
  await loadingStore.withActionLoading(async () => {
    try {
      await $fetch('/api/settings', {
        method: 'PUT',
        body: {
          ...form,
          _locale: editingLocale.value,
        },
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
</script>

<template>
  <AdminPage :title="$t('admin.settings.title')" :subtitle="$t('admin.settings.description')">
    <template #header>
      <div class="flex items-center gap-2">
        <select
          v-model="editingLocale"
          class="select select-bordered select-sm"
          @change="switchLocale(editingLocale)"
        >
          <option
            v-for="opt in localeOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.key }}
          </option>
        </select>
        <button
          class="btn btn-primary"
          :class="{ 'btn-disabled': saving }"
          @click="saveSettings"
        >
          <span v-if="saving" class="loading loading-spinner" />
          {{ $t('common.saveSettings') }}
        </button>
      </div>
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
      <button class="tab" :class="{ 'tab-active': activeTab === 'seo' }" @click="activeTab = 'seo'">
        {{ $t('admin.settings.seoTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'theme' }" @click="activeTab = 'theme'">
        {{ $t('admin.settings.themeTab') }}
      </button>
      <button class="tab" :class="{ 'tab-active': activeTab === 'about' }" @click="activeTab = 'about'">
        {{ $t('admin.settings.aboutTab') }}
      </button>
    </div>

    <AdminLoadingSpinner v-if="pending" :title="$t('common.loadingSettings')" />
    <AdminUiError v-if="error" :message="$t('common.unableToLoadSettings')" />

    <!-- GENERAL -->
    <AdminCard
      v-if="activeTab === 'general'"
      :title="$t('admin.settings.generalTitle')"
    >
      <div class="space-y-4">
        <AdminLocaleSelector
          :label="$t('admin.settings.perLanguageSettings')"
          v-model="editingLocale"
          @update:model-value="switchLocale"
        />
        <AdminUiCheckBox
          :label="$t('admin.settings.showSidebar')"
          v-model="form.general.showSidebar"
        />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiSelect
            :label="$t('admin.settings.direction')"
            v-model="form.general.direction"
            :options="[
              { key: $t('admin.settings.directionLtr'), value: 'ltr' },
              { key: $t('admin.settings.directionRtl'), value: 'rtl' },
            ]"
          />
          <AdminLocaleSelector
            :label="$t('admin.settings.language')"
            v-model="form.general.language"
          />
        </div>
        <AdminUiUrl
          :label="$t('admin.settings.favicon')"
          v-model="form.general.favicon"
          mediaPicker
        />
      </div>
    </AdminCard>

    <!-- NAVBAR -->
    <AdminCard
      v-if="activeTab === 'navbar'"
      :title="$t('admin.settings.navbarTitle')"
      :subtitle="$t('admin.settings.navbarDescription')"
    >
      <div class="space-y-4">
        <AdminLocaleSelector
          :label="$t('admin.settings.perLanguageSettings')"
          v-model="editingLocale"
          @update:model-value="switchLocale"
        />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiText
            :label="$t('common.lightLogoUrl')"
            v-model="form.navbar.lightLogo"
            mediaPicker
          />
          <AdminUiText
            :label="$t('common.darkLogoUrl')"
            v-model="form.navbar.darkLogo"
            mediaPicker
          />
        </div>
        <AdminLocaleMenu
          :model-value="form.navbar.menus"
          :locale="editingLocale"
          :handler="'navbar'"
          @update:model-value="updateNavbarMenu"
          @update:locale="switchLocale"
        />
        <AdminListCreator
          @update="updateNavbarInfo"
          :list="form.navbar.info"
        />
      </div>
    </AdminCard>

    <!-- FOOTER -->
    <AdminCard
      v-if="activeTab === 'footer'"
      :title="$t('admin.settings.footerTitle')"
      :subtitle="$t('admin.settings.footerDescription')"
    >
      <div class="space-y-4">
        <AdminLocaleSelector
          :label="$t('admin.settings.perLanguageSettings')"
          v-model="editingLocale"
          @update:model-value="switchLocale"
        />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiText
            :label="$t('common.lightLogoUrl')"
            v-model="form.footer.lightLogo"
            mediaPicker
          />
          <AdminUiText
            :label="$t('common.darkLogoUrl')"
            v-model="form.footer.darkLogo"
            mediaPicker
          />
        </div>
        <AdminLocaleMenu
          :model-value="form.footer.menus"
          :locale="editingLocale"
          :handler="'footer'"
          @update:model-value="updateFooterMenu"
          @update:locale="switchLocale"
        />
        <AdminListCreator
          @update="updateFooterInfo"
          :list="form.footer.info"
        />
      </div>
    </AdminCard>

    <!-- BLOG -->
    <AdminCard
      v-if="activeTab === 'blog'"
      :title="$t('admin.settings.blogCommentsTitle')"
    >
      <AdminUiCheckBox
        :label="$t('admin.settings.commentsEnabled')"
        v-model="form.blog.commentsEnabled"
      />
      <AdminUiCheckBox
        :label="$t('admin.settings.commentsRequireApproval')"
        v-model="form.blog.commentsRequireApproval"
      />
      <AdminUiCheckBox
        :label="$t('admin.settings.allowAnonymousComments')"
        v-model="form.blog.allowAnonymousCommentsByDefault"
      />
      <AdminUiText
        :label="$t('common.recaptchaSiteKey')"
        v-model="form.blog.recaptchaSiteKey"
      />
      <AdminUiText
        :label="$t('common.recaptchaSecretKey')"
        v-model="form.blog.recaptchaSecretKey"
      />
    </AdminCard>

    <!-- SEO -->
    <AdminCard
      v-if="activeTab === 'seo'"
      :title="$t('admin.settings.seoTitle')"
    >
      <div class="mb-6 pb-4 border-b border-base-300">
        <AdminLocaleSelector
          :label="$t('admin.settings.perLanguage')"
          v-model="editingLocale"
          @update:model-value="switchLocale"
        />
        <div class="grid gap-4 md:grid-cols-2 mt-4">
          <AdminUiText
            :label="$t('admin.settings.siteName')"
            v-model="form.seo.siteName"
          />
          <AdminUiText
            :label="$t('admin.settings.defaultTitle')"
            v-model="form.seo.defaultTitle"
          />
          <AdminUiText
            :label="$t('admin.settings.titleSuffix')"
            v-model="form.seo.titleSuffix"
          />
          <AdminUiTextarea
            :label="$t('admin.settings.defaultDescription')"
            v-model="form.seo.defaultDescription"
          />
          <AdminUiUrl
            :label="$t('admin.settings.defaultOgImage')"
            v-model="form.seo.defaultOgImage"
            mediaPicker
          />
        </div>
      </div>
      <div>
        <h3 class="font-semibold text-sm opacity-70 mb-2">
          {{ $t('admin.settings.siteWide') }}
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <AdminUiUrl
            :label="$t('admin.settings.siteUrl')"
            v-model="form.seo.siteUrl"
          />
          <AdminUiText
            :label="$t('admin.settings.robotsPolicy')"
            v-model="form.seo.robots"
          />
          <AdminUiText
            :label="$t('admin.settings.twitterHandle')"
            v-model="form.seo.twitterHandle"
          />
          <AdminUiText
            :label="$t('admin.settings.googleVerification')"
            v-model="form.seo.googleSiteVerification"
          />
          <AdminUiText
            :label="$t('admin.settings.bingVerification')"
            v-model="form.seo.bingSiteVerification"
          />
          <AdminUiText
            :label="$t('admin.settings.yandexVerification')"
            v-model="form.seo.yandexVerification"
          />
        </div>
      </div>
    </AdminCard>

    <!-- THEME -->
    <AdminCard
      v-if="activeTab === 'theme'"
      :title="$t('admin.settings.themeTitle')"
    >
      <AdminUiSelect
        :label="$t('admin.settings.themePreset')"
        v-model="form.theme.preset"
        :options="[
          { key: 'light', value: 'light' },
          { key: 'dark', value: 'dark' },
          { key: 'winter', value: 'winter' },
          { key: 'cupcake', value: 'cupcake' },
          { key: 'dracula', value: 'dracula' },
        ]"
      />
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <h4 class="font-semibold mb-2">{{ $t('admin.settings.lightPalette') }}</h4>
          <label class="form-control">
            <span class="label-text">Primary</span>
            <input v-model="form.theme.light.primary" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Secondary</span>
            <input v-model="form.theme.light.secondary" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Accent</span>
            <input v-model="form.theme.light.accent" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Neutral</span>
            <input v-model="form.theme.light.neutral" type="color" class="input input-bordered h-10" />
          </label>
        </div>
        <div>
          <h4 class="font-semibold mb-2">{{ $t('admin.settings.darkPalette') }}</h4>
          <label class="form-control">
            <span class="label-text">Primary</span>
            <input v-model="form.theme.dark.primary" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Secondary</span>
            <input v-model="form.theme.dark.secondary" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Accent</span>
            <input v-model="form.theme.dark.accent" type="color" class="input input-bordered h-10" />
          </label>
          <label class="form-control">
            <span class="label-text">Neutral</span>
            <input v-model="form.theme.dark.neutral" type="color" class="input input-bordered h-10" />
          </label>
        </div>
      </div>
      <button class="btn" @click="resetTheme">{{ $t('admin.settings.resetTheme') }}</button>
    </AdminCard>

    <!-- ABOUT -->
    <AdminCard
      v-if="activeTab === 'about'"
      :title="$t('admin.settings.aboutTitle')"
    >
      <AdminListCreator
        @update="updateAboutInfo"
        :list="form.about.info"
      />
    </AdminCard>
  </AdminPage>
</template>