<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'
const toastStore = useToastStore()

const form = reactive({ name: '', email: '', phone: '', message: '' })
const sending = ref(false)

const send = async () => {
  if (!form.name || !form.email || !form.message) {
    toastStore.push('Please fill in all required fields', 'error')
    return
  }
  sending.value = true
  try {
    await $fetch('/api/contact-messages', { method: 'POST', body: form })
    toastStore.push('Message sent successfully! We\'ll be in touch soon.', 'success')
    form.name = ''; form.email = ''; form.phone = ''; form.message = ''
  } catch {
    toastStore.push('Failed to send message. Please try again.', 'error')
  } finally {
    sending.value = false
  }
}

const info = [
  { icon: '✦', label: 'Location', value: '123 Smile Street, NY 10001' },
  { icon: '✦', label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: '✦', label: 'Email', value: 'hello@dentalis.com' },
  { icon: '✦', label: 'Hours', value: 'Mon–Fri: 9AM – 7PM' },
]
</script>

<template>
  <section id="contact" class="section section-dark">
    <div class="container-premium">
      <div class="section-header" data-reveal>
        <span class="section-badge" style="color: var(--d-accent);">{{ $t('sections.contact.badge') }}</span>
        <h2 class="section-title text-white">{{ $t('sections.contact.title') }}</h2>
        <p class="section-subtitle">{{ $t('sections.contact.subtitle') }}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-start" data-reveal>
        <!-- Info -->
        <div class="space-y-6">
          <div v-for="item in info" :key="item.label" class="flex items-center gap-5 group cursor-default">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-500 group-hover:scale-110"
              style="background: rgba(161, 98, 7, 0.15); color: var(--d-accent);">
              {{ item.icon }}
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest" style="color: var(--d-text-light);">{{ item.label }}</p>
              <p class="text-white font-medium">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form class="card-premium !bg-white/5 !border-white/10" @submit.prevent="send">
          <div class="grid gap-4">
            <input v-model="form.name" class="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[var(--d-accent)] transition-all"
              :placeholder="$t('common.name') + '*'" />
            <div class="grid grid-cols-2 gap-4">
              <input v-model="form.email" class="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[var(--d-accent)] transition-all"
                :placeholder="$t('common.email') + '*'" type="email" />
              <input v-model="form.phone" class="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[var(--d-accent)] transition-all"
                :placeholder="$t('common.phone')" />
            </div>
            <textarea v-model="form.message" class="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-[var(--d-accent)] transition-all min-h-[120px]"
              :placeholder="$t('common.message') + '*'" rows="4" />
            <button type="submit" class="btn-gold w-full justify-center mt-2"
              :class="{ 'opacity-70': sending }" :disabled="sending">
              <span v-if="sending" class="loading loading-spinner loading-xs" />
              {{ $t('common.send') }} <span class="text-lg">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>