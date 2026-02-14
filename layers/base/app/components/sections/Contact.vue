<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'

const toastStore = useToastStore()
const { t } = useI18n()

const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)

const send = async () => {
  if (!form.name || !form.email || !form.message) {
    toastStore.push(t('sections.contact.required'), 'error')
    return
  }

  sending.value = true
  try {
    await $fetch('/api/contact-messages', { method: 'POST', body: form })
    toastStore.push(t('sections.contact.success'), 'success')
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch {
    toastStore.push(t('sections.contact.failed'), 'error')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="max-w-2xl mx-auto card bg-base-100 shadow">
    <div class="card-body space-y-3">
      <h2 class="card-title text-3xl">{{ t('sections.contact.title') }}</h2>
      <input v-model="form.name" class="input input-bordered" :placeholder="`${t('common.name')}*` as any" />
      <input v-model="form.email" class="input input-bordered" :placeholder="`${t('common.email')}*` as any" type="email" />
      <input v-model="form.subject" class="input input-bordered" :placeholder="t('common.subject') as any" />
      <textarea v-model="form.message" class="textarea textarea-bordered" rows="4" :placeholder="`${t('common.message')}*` as any" />
      <button class="btn btn-primary" :class="{ 'btn-disabled': sending }" @click="send">
        <span v-if="sending" class="loading loading-spinner loading-xs" />
        {{ t('sections.contact.send') }}
      </button>
    </div>
  </section>
</template>
