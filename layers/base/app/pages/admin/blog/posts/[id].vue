<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import { useLoadingStore } from '~~/layers/base/app/stores/loading'

definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

const route = useRoute()
const idParam = computed(() => String(route.params.id))
const isNew = computed(() => idParam.value === 'new')
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

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

const { data: categories } = await useFetch('/api/admin/blog/categories', { default: () => [] as any[] })

if (!isNew.value) {
  const { data } = await useFetch(`/api/admin/blog/posts/${idParam.value}`)
  watchEffect(() => {
    if (!data.value) return
    Object.assign(form, {
      ...data.value,
      excerpt: data.value.excerpt ?? '',
      featuredImage: data.value.featuredImage ?? '',
    })
  })
}

const save = async () => {
  await loadingStore.withActionLoading(async () => {
    if (isNew.value) {
      const created = await $fetch<{ id: number }>('/api/admin/blog/posts', { method: 'POST', body: form })
      toastStore.push('Post created successfully.', 'success')
      await navigateTo(`/admin/blog/posts/${created.id}`)
      return
    }

    await $fetch(`/api/admin/blog/posts/${idParam.value}`, { method: 'PUT', body: form })
    toastStore.push('Post saved successfully.', 'success')
  })
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">{{ isNew ? 'Create Blog Post' : 'Edit Blog Post' }}</h2>

    <section class="card bg-base-100 shadow"><div class="card-body space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <input v-model="form.title" class="input input-bordered" placeholder="Title" />
        <input v-model="form.slug" class="input input-bordered" placeholder="slug" />
      </div>

      <textarea v-model="form.excerpt" class="textarea textarea-bordered" rows="3" placeholder="Excerpt" />
      <AdminTextEditor v-model="form.content" />
      <input v-model="form.featuredImage" class="input input-bordered" placeholder="Featured image URL" />

      <div class="grid gap-4 md:grid-cols-3">
        <select v-model="form.status" class="select select-bordered">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <label class="label cursor-pointer justify-start gap-2"><input v-model="form.allowComments" type="checkbox" class="checkbox" /><span>Allow comments</span></label>
        <label class="label cursor-pointer justify-start gap-2"><input v-model="form.allowAnonymousComments" type="checkbox" class="checkbox" /><span>Allow guest comments</span></label>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Categories</h3>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <label v-for="cat in categories" :key="cat.id" class="label cursor-pointer justify-start gap-2 rounded border px-3 py-2">
            <input v-model="form.categoryIds" type="checkbox" class="checkbox checkbox-sm" :value="cat.id" />
            <span>{{ cat.name }}</span>
          </label>
        </div>
      </div>

      <button class="btn btn-primary w-fit" @click="save">Save Post</button>
    </div></section>
  </div>
</template>
