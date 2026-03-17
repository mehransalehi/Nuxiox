<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
definePageMeta({ middleware: ['authenticated'], layout: 'admin' })

useHead(() => ({ title: $t('admin.modules.testimonials') }))
const toastStore = useToastStore()
const { locale, locales } = useI18n()
const { data, refresh } = await useFetch('/api/admin/testimonials', { default: () => [] as any[] })
const form = reactive<any>({ id: null, locale: '', name: '', role: '', content: '', avatar: '', rating: 5, isActive: true })
const reset = () => Object.assign(form, { id: null, locale: '', name: '', role: '', content: '', avatar: '', rating: 5, isActive: true })
const edit = (item: any) => {
    Object.assign(form, structuredClone(item))
}
const save = async () => {
    try {
        await $fetch(form.id ? `/api/admin/testimonials/${form.id}` : '/api/admin/testimonials',
            { method: form.id ? 'PUT' : 'POST', body: form });
        reset();
        toastStore.push($t('sections.testimonials.saved'), 'success')
        await refresh()
    } catch (error: any) {
        toastStore.showZodError(error)
    }
}
const remove = async (id: number, locale: string) => { await $fetch(`/api/admin/testimonials/${id}?locale=${locale}`, { method: 'DELETE' }); await refresh() }
</script>
<template>

    <AdminPage>
        <div class="grid gap-4 md:grid-cols-2">
            <AdminCard :title="form.id ? $t('admin.modules.editItem') : $t('admin.modules.createItem')">
                <AdminUiText :label="$t('common.name')" v-model="form.name" />
                <AdminUiText :label="$t('common.role')" v-model="form.role" />
                <AdminUiTextarea :label="$t('admin.blog.content')" v-model="form.content" />
                <AdminLocaleSelector :label="$t('common.locale')" v-model="form.locale" />
                <AdminUiUrl :label="$t('common.avatar')" v-model="form.avatar" />
                <AdminUiNumber :label="$t('common.rate')" v-model="form.rating" />

                <AdminUiCheckBox :label="$t('admin.modules.active')" v-model="form.isActive" />
                <button class="btn btn-primary" @click="save">{{ $t('common.save') }}</button>
                <button class="btn" v-if="form.id" @click="reset">{{ $t('common.cancel') }}</button>
            </AdminCard>
            <AdminCard :title="$t('admin.modules.colleagues')">
                <div v-for="item in data" :key="item.id" class="flex items-center justify-between rounded border p-2">
                    <div>
                        <p class="font-medium">{{ item.name }}</p>
                        <p class="text-xs opacity-70">{{ item.content }}</p>
                    </div>
                    <div class="flex gap-2"><button class="btn btn-xs" @click="edit(item)">{{ $t('common.edit')
                            }}</button><button class="btn btn-xs btn-error" @click="remove(item.id, item.locale)">{{
                                $t('common.delete') }}</button></div>
                </div>
            </AdminCard>
        </div>
    </AdminPage>
</template>
