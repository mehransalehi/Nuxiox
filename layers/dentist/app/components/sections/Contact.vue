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
  <!-- <section class="scroll-reveal rounded-3xl bg-base-200/60 p-6 md:p-8">
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
  </section> -->
  <section class="bg-white py-20">
    <div class="mx-auto max-w-6xl px-6">
      <div class="text-center" data-animate>
        <p class="text-xs font-bold uppercase tracking-[0.28em] text-primary">get in touch</p>
        <h2 class="mt-2 text-4xl font-extrabold text-slate-800">Book Your Appointment</h2>
      </div>

      <div class="mt-10 grid gap-8 md:grid-cols-3">
        <div class="space-y-4" data-animate>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"><i class="fa-solid fa-location-dot text-primary"></i> 123 Smile Street, NY</div>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"><i class="fa-solid fa-phone text-primary"></i> +1 (555) 101-9999</div>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"><i class="fa-solid fa-envelope text-primary"></i> hello@denti.com</div>
        </div>
        <form class="card col-span-2 bg-slate-100 p-6 shadow" data-animate>
          <div class="grid gap-4 md:grid-cols-2">
            <input class="input input-bordered w-full bg-white" placeholder="Full Name">
            <input class="input input-bordered w-full bg-white" placeholder="Phone">
            <input class="input input-bordered w-full bg-white" placeholder="Email">
            <input class="input input-bordered w-full bg-white" placeholder="Date">
          </div>
          <textarea class="textarea textarea-bordered mt-4 w-full bg-white" rows="4" placeholder="Message"></textarea>
          <button class="btn btn-primary mt-4 text-white">Book an Appointment</button>
        </form>
      </div>
    </div>
  </section>
</template>
