<script setup lang="ts">
import { useToastStore } from '~~/packages/base/app/stores/toast'

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

const contactInfo = [
  { emoji: '📍', label: 'Location', value: '123 Health Street, NY' },
  { emoji: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
  { emoji: '✉️', label: 'Email', value: 'hello@kidsmed.com' },
  { emoji: '🕐', label: 'Hours', value: 'Mon–Fri 8:00 AM – 6:00 PM' },
]
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0" style="background: linear-gradient(180deg, var(--kids-bg) 0%, white 100%);" />
    <div class="absolute inset-0 dots-pattern opacity-20" />
    <div class="absolute top-20 right-10 w-32 h-32 rounded-full" style="background: var(--pastel-pink); filter: blur(50px); opacity: 0.3; animation: blobFloat 8s ease-in-out infinite;" />
    <div class="absolute bottom-20 left-10 w-40 h-40 rounded-full" style="background: var(--pastel-blue); filter: blur(60px); opacity: 0.25; animation: blobFloat 10s ease-in-out infinite 2s;" />

    <div class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Section Header -->
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block clay-card !rounded-full !px-5 !py-2 text-sm font-semibold mb-4"
          style="background: white; color: var(--kids-primary-dark);">
          📋 Get in Touch
        </span>
        <h2 class="font-fredoka text-4xl md:text-5xl font-bold mb-4" style="color: var(--kids-text);">
          We'd Love to<br>Hear From You
        </h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--kids-text-muted);">
          Have a question or want to schedule a visit? Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <div class="grid gap-10 lg:grid-cols-3">
        <!-- Left: Contact Info Cards -->
        <div class="space-y-4" data-reveal>
          <div
            v-for="(item, i) in contactInfo"
            :key="item.label"
            class="clay-card !rounded-2xl !p-5 flex items-center gap-4 hover:translate-x-2 transition-all duration-500 cursor-default"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
              style="background: var(--kids-bg-alt);">
              {{ item.emoji }}
            </div>
            <div>
              <div class="text-xs uppercase font-semibold tracking-wider" style="color: var(--kids-text-muted);">
                {{ item.label }}
              </div>
              <div class="font-fredoka font-semibold" style="color: var(--kids-text);">
                {{ item.value }}
              </div>
            </div>
          </div>

          <!-- CTA mini-card -->
          <div class="clay-card !rounded-2xl !p-6 text-center mt-6"
            style="background: linear-gradient(135deg, var(--kids-primary) 0%, var(--kids-primary-dark) 100%); color: white;">
            <div class="text-4xl mb-2">🩺</div>
            <h3 class="font-fredoka font-bold text-lg">Emergency?</h3>
            <p class="text-sm opacity-90 mt-1">Call us anytime — we're here for your little ones.</p>
            <a href="tel:+15551234567" class="inline-flex items-center gap-2 mt-3 font-fredoka font-bold text-lg hover:underline">
              📞 +1 (555) 123-4567
            </a>
          </div>
        </div>

        <!-- Right: Form -->
        <form class="clay-card !rounded-3xl !p-8 lg:col-span-2" data-reveal data-reveal-delay="200">
          <div class="grid gap-5 md:grid-cols-2">
            <fieldset class="fieldset">
              <legend class="fieldset-legend font-fredoka font-semibold" style="color: var(--kids-text);">
                👶 Full Name
              </legend>
              <input
                v-model="form.name"
                type="text"
                class="input w-full bg-white rounded-xl"
                placeholder="Your full name"
              />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend font-fredoka font-semibold" style="color: var(--kids-text);">
                ✉️ Email
              </legend>
              <input
                v-model="form.email"
                type="email"
                class="input w-full bg-white rounded-xl"
                placeholder="your@email.com"
              />
            </fieldset>
            <fieldset class="fieldset md:col-span-2">
              <legend class="fieldset-legend font-fredoka font-semibold" style="color: var(--kids-text);">
                📝 Subject
              </legend>
              <input
                v-model="form.subject"
                type="text"
                class="input w-full bg-white rounded-xl"
                placeholder="What is this about?"
              />
            </fieldset>
            <fieldset class="fieldset md:col-span-2">
              <legend class="fieldset-legend font-fredoka font-semibold" style="color: var(--kids-text);">
                💬 Message
              </legend>
              <textarea
                v-model="form.message"
                class="textarea textarea-bordered w-full bg-white rounded-2xl"
                rows="5"
                placeholder="Tell us how we can help..."
              />
            </fieldset>
          </div>

          <button
            type="button"
            class="clay-btn clay-btn-accent w-full justify-center mt-6 text-base !py-4"
            :class="{ 'opacity-60 pointer-events-none': sending }"
            @click="send"
          >
            <span v-if="sending" class="loading loading-spinner loading-xs" />
            <span v-else>📅</span>
            {{ sending ? 'Sending...' : 'Book an Appointment' }}
            <span class="text-xl">→</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>