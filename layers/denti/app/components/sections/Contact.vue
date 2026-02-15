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
  <section class="scroll-reveal rounded-3xl bg-base-200/60 p-6 md:p-8">
    <div class="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div class="space-y-4">
        <h2 class="text-4xl font-bold">{{ t('sections.contact.title') }}</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <input v-model="form.name" class="input input-bordered rounded-full" :placeholder="`${t('common.name')}*` as any" />
          <input v-model="form.email" class="input input-bordered rounded-full" :placeholder="`${t('common.email')}*` as any" type="email" />
          <input v-model="form.subject" class="input input-bordered rounded-full md:col-span-2" :placeholder="t('common.subject') as any" />
          <textarea v-model="form.message" class="textarea textarea-bordered rounded-2xl md:col-span-2" rows="4" :placeholder="`${t('common.message')}*` as any" />
        </div>
        <button class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600" :class="{ 'btn-disabled': sending }" @click="send">
          <span v-if="sending" class="loading loading-spinner loading-xs" />
          {{ t('sections.contact.send') }}
        </button>
      </div>
      <div class="hidden items-end justify-center rounded-2xl bg-sky-100 p-4 text-8xl lg:flex">🪥</div>
    </div>
  </section>
</template>
