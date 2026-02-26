<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.blog.postEditor') }))

const route = useRoute()
const idParam = computed(() => String(route.params.id))
const isNew = computed(() => idParam.value === 'new')
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

type SeoEntry = { key: string; value: string }

const form = reactive({
  title: '',
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

if (!isNew.value) {
  const { data } = await useFetch(`/api/admin/blog/posts/${idParam.value}`)
  watchEffect(() => {
    if (!data.value) return
    Object.assign(form, {
      ...data.value,
      excerpt: data.value.excerpt ?? '',
      featuredImage: data.value.featuredImage ?? '',
    })
    seoEntries.value = Object.entries((data.value as any).seo ?? {}).map(([key, value]) => ({ key, value: String(value ?? '') }))
    ensureSeoDefaults()
  })
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
    if (isNew.value) {
      const created = await $fetch<{ id: number }>('/api/admin/blog/posts', { method: 'POST', body: payload })
      toastStore.push($t('admin.blog.postCreated'), 'success')
      await navigateTo(`/admin/blog/posts/${created.id}`)
      return
    }

    await $fetch(`/api/admin/blog/posts/${idParam.value}`, { method: 'PUT', body: payload })
    toastStore.push($t('admin.blog.postSaved'), 'success')
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">{{ isNew ? $t('admin.blog.createPost') : $t('admin.blog.editPost') }}</h2>

    <section class="card bg-base-100 shadow"><div class="card-body space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <input v-model="form.title" class="input input-bordered" :placeholder="$t('common.title') as any" aria-label="Post title" />
        <input v-model="form.slug" class="input input-bordered" :placeholder="$t('common.slug') as any" aria-label="Post slug" />
      </div>

      <textarea v-model="form.excerpt" class="textarea textarea-bordered" rows="3" :placeholder="$t('admin.blog.excerpt') as any" aria-label="Post excerpt" />
      <AdminQuillEditor v-model="form.content" />
      <input v-model="form.featuredImage" class="input input-bordered" :placeholder="$t('admin.blog.featuredImage') as any" aria-label="Featured image URL" />

      <div class="space-y-2">
        <div class="flex items-center justify-between"><h3 class="font-semibold">{{ $t('admin.blog.seoMeta') }}</h3><button class="btn btn-xs" @click="seoEntries.push({ key: '', value: '' })">{{ $t('admin.blog.addSeoField') }}</button></div>
        <div v-for="(entry, index) in seoEntries" :key="`blog-seo-${index}`" class="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <input v-model="entry.key" class="input input-bordered" :placeholder="$t('admin.blog.metaKey') as any" />
          <input v-model="entry.value" class="input input-bordered" :placeholder="$t('admin.blog.metaValue') as any" />
          <button class="btn btn-ghost" @click="seoEntries.splice(index, 1)">✕</button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <select v-model="form.status" class="select select-bordered" :aria-label="$t('common.status') as any"><option value="draft">{{ $t('common.draft') }}</option><option value="published">{{ $t('common.published') }}</option><option value="archived">{{ $t('admin.blog.archived') }}</option></select>
        <label class="label cursor-pointer justify-start gap-2"><input v-model="form.allowComments" type="checkbox" class="checkbox" /><span>{{ $t('admin.blog.allowComments') }}</span></label>
        <label class="label cursor-pointer justify-start gap-2"><input v-model="form.allowAnonymousComments" type="checkbox" class="checkbox" /><span>{{ $t('admin.blog.allowGuestComments') }}</span></label>
      </div>

      <div>
        <h3 class="font-semibold mb-2">{{ $t('admin.blog.categories') }}</h3>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <label v-for="cat in categories" :key="cat.id" class="label cursor-pointer justify-start gap-2 rounded border px-3 py-2">
            <input v-model="form.categoryIds" type="checkbox" class="checkbox checkbox-sm" :value="cat.id" />
            <span>{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <button class="btn btn-primary w-fit" @click="save">{{ $t('admin.blog.savePost') }}</button>
    </div></section>
  </div>
</template>
