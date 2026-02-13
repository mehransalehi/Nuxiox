<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

const { data, refresh } = await useFetch('/api/admin/blog/categories', { default: () => [] as any[] })
const form = reactive({ name: '', slug: '', description: '' })
const editingId = ref<number | null>(null)

const submit = async () => {
  if (editingId.value) {
    await $fetch(`/api/admin/blog/categories/${editingId.value}`, { method: 'PUT', body: form })
  } else {
    await $fetch('/api/admin/blog/categories', { method: 'POST', body: form })
  }
  form.name = ''; form.slug = ''; form.description = ''; editingId.value = null
  await refresh()
}

const edit = (row: any) => {
  editingId.value = row.id
  form.name = row.name
  form.slug = row.slug
  form.description = row.description || ''
}

const remove = async (id: number) => {
  await $fetch(`/api/admin/blog/categories/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Blog Categories</h2>
    <section class="card bg-base-100 shadow"><div class="card-body space-y-3">
      <h3 class="card-title">{{ editingId ? 'Edit category' : 'Create category' }}</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <input v-model="form.name" class="input input-bordered" placeholder="Name" />
        <input v-model="form.slug" class="input input-bordered" placeholder="slug" />
      </div>
      <textarea v-model="form.description" class="textarea textarea-bordered" placeholder="Description" />
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="submit">{{ editingId ? 'Update' : 'Create' }}</button>
        <button v-if="editingId" class="btn" @click="editingId=null; form.name=''; form.slug=''; form.description=''">Cancel</button>
      </div>
    </div></section>

    <section class="card bg-base-100 shadow"><div class="card-body overflow-x-auto">
      <table class="table"><thead><tr><th>Name</th><th>Slug</th><th>Posts</th><th>Actions</th></tr></thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td>{{ row.name }}</td><td>{{ row.slug }}</td><td>{{ row.postsCount }}</td>
          <td class="space-x-2"><button class="btn btn-xs" @click="edit(row)">Edit</button><button class="btn btn-xs btn-error" @click="remove(row.id)">Delete</button></td>
        </tr>
      </tbody></table>
    </div></section>
  </div>
</template>
