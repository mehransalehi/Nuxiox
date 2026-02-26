<script setup lang="ts">
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.modules.colleagues') }))
const { data, refresh } = await useFetch('/api/admin/colleagues', { default: () => [] as any[] })
const form = reactive<any>({ id: null, title: '', subtitle: '', description: '', icon: '', image: '', link: '', sortOrder: 0, isActive: true, extra: [] })
const reset = () => Object.assign(form, { id: null, title: '', subtitle: '', description: '', icon: '', image: '', link: '', sortOrder: 0, isActive: true, extra: [] })
const edit = (item: any) => Object.assign(form, structuredClone(item), { extra: Array.isArray(item.extra) ? item.extra : [] })
const save = async () => { await $fetch(form.id ? `/api/admin/colleagues/${form.id}` : '/api/admin/colleagues', { method: form.id ? 'PUT' : 'POST', body: form }); reset(); await refresh() }
const remove = async (id: number) => { await $fetch(`/api/admin/colleagues/${id}`, { method: 'DELETE' }); await refresh() }
</script>
<template><div class="grid gap-6 lg:grid-cols-2">
<section class="card bg-base-100 shadow"><div class="card-body space-y-3"><h2 class="card-title">{{ form.id ? $t('admin.modules.editItem') : $t('admin.modules.createItem') }}</h2>
<input v-model="form.title" class="input input-bordered" :placeholder="$t('common.title') as any" /><input v-model="form.subtitle" class="input input-bordered" placeholder="Subtitle" />
<textarea v-model="form.description" class="textarea textarea-bordered" placeholder="Description" />
<div class="grid gap-2 md:grid-cols-2"><input v-model="form.icon" class="input input-bordered" placeholder="Icon class" /><input v-model="form.image" class="input input-bordered" placeholder="Image URL" /><input v-model="form.link" class="input input-bordered" placeholder="Link" /><input v-model.number="form.sortOrder" class="input input-bordered" type="number" placeholder="Order" /></div>
<label class="label cursor-pointer justify-start gap-2"><input v-model="form.isActive" type="checkbox" class="checkbox" /><span>{{ $t('admin.modules.active') }}</span></label>
<div class="space-y-2"><div class="flex justify-between"><p class="font-medium">{{ $t('admin.modules.extraInfo') }}</p><button class="btn btn-xs" @click="form.extra.push({ key: '', value: '' })">{{ $t('common.addInfo') }}</button></div>
<div v-for="(entry, i) in form.extra" :key="i" class="grid grid-cols-[1fr_1fr_auto] gap-2"><input v-model="entry.key" class="input input-bordered" :placeholder="$t('common.label') as any" /><input v-model="entry.value" class="input input-bordered" :placeholder="$t('common.valueOrUrl') as any" /><button class="btn btn-ghost" @click="form.extra.splice(i,1)">✕</button></div></div>
<div class="flex gap-2"><button class="btn btn-primary" @click="save">{{ $t('common.save') }}</button><button class="btn" @click="reset">{{ $t('common.cancel') }}</button></div></div></section>
<section class="card bg-base-100 shadow"><div class="card-body"><h2 class="card-title">{{ $t('admin.modules.colleagues') }}</h2><div class="space-y-2"><div v-for="item in data" :key="item.id" class="flex items-center justify-between rounded border p-2"><div><p class="font-medium">{{ item.title }}</p></div><div class="flex gap-2"><button class="btn btn-xs" @click="edit(item)">{{ $t('common.edit') }}</button><button class="btn btn-xs btn-error" @click="remove(item.id)">{{ $t('common.delete') }}</button></div></div></div></div></section>
</div></template>
