<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'

const toastStore = useToastStore()


const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)

const send = async () => {
  if (!form.name || !form.email || !form.message) {
    toastStore.push($t('sections.contact.required'), 'error')
    return
  }

  sending.value = true
  try {
    await $fetch('/api/contact-messages', { method: 'POST', body: form })
    toastStore.push($t('sections.contact.success'), 'success')
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch {
    toastStore.push($t('sections.contact.failed'), 'error')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="grid gap-6 rounded-4xl bg-[#eef8ff] p-6 scroll-reveal lg:grid-cols-[0.9fr_1.1fr] md:p-8">
    <div class="space-y-3">
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">Contact</p>
      <h2 class="text-4xl font-extrabold">{{ $t('sections.contact.title') }}</h2>
      <p class="text-sm opacity-75">Tell us about your dental concern and preferred time. Our team will get back quickly.</p>
      <div class="rounded-2xl bg-white p-4 text-sm">
        <p class="font-semibold">Clinic Hours</p>
        <p class="opacity-70">Mon - Sat: 9:00 AM - 8:00 PM</p>
      </div>
    </div>

    <div class="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
      <div class="grid gap-3 md:grid-cols-2">
        <input v-model="form.name" class="input input-bordered rounded-full" :placeholder="`${$t('common.label')}*` as any">
        <input v-model="form.email" class="input input-bordered rounded-full" placeholder="Email*" type="email">
        <input v-model="form.subject" class="input input-bordered rounded-full md:col-span-2" placeholder="Subject">
        <textarea v-model="form.message" class="textarea textarea-bordered rounded-2xl md:col-span-2" rows="5" placeholder="Message*" />
      </div>
      <button class="btn rounded-full border-none bg-sky-600 text-white hover:bg-sky-700" :class="{ 'btn-disabled': sending }" @click="send">
        <span v-if="sending" class="loading loading-spinner loading-xs" />
        {{ $t('sections.contact.send') }}
      </button>
    </div>
  </section>
</template>
