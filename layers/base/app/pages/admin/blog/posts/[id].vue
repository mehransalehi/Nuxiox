<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

type BlogPost = {
  id: number
  title: string
  locale: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  status: 'draft' | 'published' | 'archived'
  allowComments: boolean
  allowAnonymousComments: boolean
  categoryIds: number[]
  seo: Record<string, string>
}

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.blog.postEditor') }))

const route = useRoute()
const idParam = computed(() => String(route.params.id))
const localeParam = computed(() => route.query.locale)
const isNew = computed(() => idParam.value === 'new')
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const { locale, locales, setLocale } = useI18n()

type SeoEntry = { key: string; value: string }

const form = reactive({
  title: '',
  locale: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  allowComments: true,
  allowAnonymousComments: true,
  categoryIds: [] as number[],
})

const seoEntries = ref<SeoEntry[]>([])
const { data: categories } = await useFetch('/api/admin/blog/categories', { default: () => [] as any[] })
const localCategories = computed(() =>
  categories.value.filter(c => c.locale === localeParam.value)
)

const ensureSeoDefaults = () => {
  const map = new Map(seoEntries.value.map((entry) => [entry.key, entry]))
  const defaults: SeoEntry[] = [
    { key: 'title', value: form.title || 'Untitled post' },
    { key: 'description', value: form.excerpt || `Read ${form.title || 'this post'} on our blog.` },
    { key: 'ogTitle', value: form.title || 'Untitled post' },
    { key: 'ogDescription', value: form.excerpt || `Read ${form.title || 'this post'} on our blog.` },
    { key: 'canonical', value: form.slug ? `/blog/${form.slug}` : '' },
    { key: 'robots', value: 'index,follow' },
  ]

  for (const item of defaults) {
    const existing = map.get(item.key)
    if (!existing) {
      seoEntries.value.push({ ...item })
      continue
    }
    if (!existing.value.trim()) existing.value = item.value
  }
}

const updateSeoEntries = (list: any) => {
  seoEntries.value = list
}
if (!isNew.value) {
  const { data } = await useFetch<BlogPost>(
    `/api/admin/blog/posts/${idParam.value}?locale=${localeParam.value}`
  )
  watch(data, (value) => {
    if (!value) return

    Object.assign(form, {
      title: value.title ?? '',
      locale: value.locale ?? locale.value,
      slug: value.slug ?? '',
      excerpt: value.excerpt ?? '',
      content: value.content ?? '',
      featuredImage: value.featuredImage ?? '',
      status: value.status ?? 'draft',
      allowComments: value.allowComments ?? true,
      allowAnonymousComments: value.allowAnonymousComments ?? true,
      categoryIds: [...(value.categoryIds ?? [])]
    })

    seoEntries.value = Object.entries(value.seo ?? {}).map(([key, value]) => ({
      key,
      value: String(value ?? '')
    }))

    ensureSeoDefaults()
  }, { immediate: true })
} else {
  ensureSeoDefaults()
}

watch(() => [form.title, form.slug, form.excerpt], ensureSeoDefaults)

const toSeoJson = () => {
  const json: Record<string, string> = {}
  for (const entry of seoEntries.value) {
    const key = entry.key.trim()
    if (!key) continue
    json[key] = entry.value
  }
  return json
}

const save = async () => {
  await loadingStore.withActionLoading(async () => {
    const payload = { ...form, seo: toSeoJson() }
    try {
      if (isNew.value) {
        const created = await $fetch<{ id: number }>('/api/admin/blog/posts', { method: 'POST', body: payload })
        toastStore.push($t('admin.blog.postCreated'), 'success')
        await navigateTo(`/admin/blog/posts/${created.id}`)
      } else {
        await $fetch(`/api/admin/blog/posts/${idParam.value}?locale=${localeParam.value}`, { method: 'PUT', body: payload })
        toastStore.push($t('admin.blog.postSaved'), 'success')
      }
    } catch (error: any) {
      toastStore.showZodError(error);
    }
  })
}
</script>

<template>
  <AdminPage :title="isNew ? $t('admin.blog.createPost') : $t('admin.blog.editPost')">
    <AdminCard>
      <div class="grid gap-4 md:grid-cols-2">
        <AdminUiText :label="$t('common.title')" v-model="form.title" />
        <AdminUiText :label="$t('common.slug')" v-model="form.slug" />
        <AdminUiTextarea :label="$t('admin.blog.excerpt')" v-model="form.excerpt" />
        <AdminLocaleSelector :label="$t('common.locale')" v-model="form.locale" />
      </div>
      <AdminQuillEditor v-model="form.content" />
      <AdminUiUrl :label="$t('admin.blog.featuredImage')" v-model="form.featuredImage" />
      <AdminListCreator @update="updateSeoEntries" :list="seoEntries" :title="$t('admin.blog.seoMeta')"
        :button-text="$t('admin.blog.addSeoField')" />
      <div class="grid gap-4 md:grid-cols-3">
        <AdminUiSelect :label="$t('common.status')" v-model="form.status" :options="[
          { key: $t('common.draft'), value: 'draft' },
          { key: $t('common.published'), value: 'published' },
          { key: $t('admin.blog.archived'), value: 'archived' }
        ]" />
        <AdminUiCheckBox :label="$t('admin.blog.allowComments')" v-model="form.allowComments" />
        <AdminUiCheckBox :label="$t('admin.blog.allowGuestComments')" v-model="form.allowAnonymousComments" />
      </div>
      <div>
        <h3 class="font-semibold mb-2">{{ $t('admin.blog.categories') }}</h3>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <label v-for="cat in localCategories" :key="cat.id"
            class="label cursor-pointer justify-start gap-2 rounded border px-3 py-2">
            <input v-model="form.categoryIds" type="checkbox" class="checkbox checkbox-sm" :value="cat.id" />
            <span>{{ cat.name }}</span>
          </label>
        </div>
      </div>
    </AdminCard>
    <button class="btn btn-primary w-fit" @click="save">{{ $t('admin.blog.savePost') }}</button>
  </AdminPage>
</template>
