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
  <!-- <section class="scroll-reveal rounded-3xl bg-base-200/60 p-6 md:p-8">
    <div class="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div class="space-y-4">
        <h2 class="text-4xl font-bold">{{ $t('sections.contact.title') }}</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <input v-model="form.name" class="input input-bordered rounded-full" :placeholder="`${$t('common.name')}*` as any" />
          <input v-model="form.email" class="input input-bordered rounded-full" :placeholder="`${$t('common.email')}*` as any" type="email" />
          <input v-model="form.subject" class="input input-bordered rounded-full md:col-span-2" :placeholder="$t('common.subject') as any" />
          <textarea v-model="form.message" class="textarea textarea-bordered rounded-2xl md:col-span-2" rows="4" :placeholder="`${$t('common.message')}*` as any" />
        </div>
        <button class="btn rounded-full border-none bg-orange-500 text-white hover:bg-orange-600" :class="{ 'btn-disabled': sending }" @click="send">
          <span v-if="sending" class="loading loading-spinner loading-xs" />
          {{ $t('sections.contact.send') }}
        </button>
      </div>
      <div class="hidden items-end justify-center rounded-2xl bg-sky-100 p-4 text-8xl lg:flex">🪥</div>
    </div>
  </section> -->
  <section class="bg-white py-20">
    <div class="mx-auto max-w-6xl px-6">
      <div class="text-center" data-animate>
        <UiTopTitle>get in touch</UiTopTitle>
        <UiTitle>Book Your Appointment</UiTitle>
        <UiSubTitle>Ready for a healthier smile? Fill in the form below and we'll get back to you<br> within 24 hours.
        </UiSubTitle>
      </div>

      <div class="mt-10 grid gap-8 md:grid-cols-3 grid-cols-1">
        <ul class="list rounded-box mt-4">
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="h-15 aspect-square flex justify-center items-center rounded-2xl bg-primary/10 text-primary text-3xl">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="flex justify-center items-start flex-col">
              <div class="text-lg uppercase font-semibold opacity-60">Location</div>
              <div>123 Smile Street, NY</div>
            </div>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="h-15 aspect-square flex justify-center items-center rounded-2xl bg-primary/10 text-primary text-3xl">
              <i class="fa-solid fa-phone"></i>
            </div>
            <div class="flex justify-center items-start flex-col">
              <div class="text-lg uppercase font-semibold opacity-60">Phone</div>
              <div>123 Smile Street, NY</div>
            </div>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="h-15 aspect-square flex justify-center items-center rounded-2xl bg-primary/10 text-primary text-3xl">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="flex justify-center items-start flex-col">
              <div class="text-lg uppercase font-semibold opacity-60">Email</div>
              <div>123 Smile Street, NY</div>
            </div>
          </li>
          <li class="list-row group items-center hover:bg-primary/3 transition-all duration-500 cursor-pointer">
            <div class="h-15 aspect-square flex justify-center items-center rounded-2xl bg-primary/10 text-primary text-3xl">
              <i class="fa-solid fa-clock"></i>
            </div>
            <div class="flex justify-center items-start flex-col">
              <div class="text-lg uppercase font-semibold opacity-60">Hours</div>
              <div>123 Smile Street, NY</div>
            </div>
          </li>

        </ul>
        <!-- <div class="space-y-4" data-animate>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"> 123 Smile Street, NY</div>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"><i
              class="fa-solid fa-phone text-primary"></i> +1 (555) 101-9999</div>
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 shadow-sm"><i
              class="fa-solid fa-envelope text-primary"></i> hello@denti.com</div>
        </div> -->
        <form class="card col-span-2 bg-slate-100 p-6 shadow" data-animate>
          <div class="grid gap-x-2 md:grid-cols-2">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Full Name</legend>
              <input type="text" class="input w-full" placeholder="Full Name" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Email</legend>
              <input type="text" class="input w-full" placeholder="Email" />
            </fieldset>
            <fieldset class="fieldset col-span-2">
              <legend class="fieldset-legend">Subject</legend>
              <input type="text" class="input w-full" placeholder="Subject" />
            </fieldset>
            <fieldset class="fieldset col-span-2">
              <legend class="fieldset-legend">Message</legend>
              <textarea class="textarea textarea-bordered mt-4 w-full bg-white" rows="4"
                placeholder="Message"></textarea>
            </fieldset>
          </div>
          <button class="btn btn-primary btn-xl mt-4 text-white text-[16px] rounded-xl">Book an Appointment</button>
        </form>
      </div>
    </div>
  </section>
</template>
