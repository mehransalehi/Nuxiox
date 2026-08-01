<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.blog.posts') }))

const { data, refresh } = await useFetch('/api/admin/blog/posts', { default: () => [] as any[] })

const updateStatus = async (id: number, status: string) => {
  try {
    await $fetch(`/api/admin/blog/posts/${id}/status`, { method: 'PATCH', body: { status } })
    await refresh()
  } catch {}
}

const removePost = async (id: number) => {
  await $fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <AdminPage :title="$t('admin.blog.posts')">
    <template #header>
      <NuxtLink class="btn btn-primary" to="/admin/blog/posts/new">{{ $t('admin.blog.createPost') }}</NuxtLink>
    </template>
    <AdminCard>
      <table class="table" v-if="data.length > 0">
        <thead>
          <tr>
            <th>{{ $t('common.title') }}</th>
            <th>{{ $t('common.status') }}</th>
            <th>{{ $t('common.slug') }}</th>
            <th>{{ $t('common.locale') }}</th>
            <th>{{ $t('admin.blog.comments') }}</th>
            <th>{{ $t('admin.blog.allowComments') }}</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.id">
            <td>{{ row.title }}</td>
            <td>
                  <select
                    class="select select-bordered select-xs w-28"
                    :value="row.status"
                    @change="updateStatus(row.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
            <td>{{ row.slug }}</td>
            <td>{{ row.locale }}</td>
            <td>{{ row.commentsCount }}</td>
            <td>{{ row.allowComments ? $t('common.yes') : $t('common.no') }}</td>
            <td class="space-x-2">
              <NuxtLink class="btn btn-xs" :to="$localePath(`/admin/blog/posts/${row.id}?locale=${row.locale}`)">{{
                $t('common.edit') }}
              </NuxtLink>
              <button class="btn btn-xs btn-error" @click="removePost(row.id)">{{ $t('common.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <AdminThereIsNo v-else>{{ $t("admin.blog.posts") }}</AdminThereIsNo>
    </AdminCard>
  </AdminPage>
</template>
