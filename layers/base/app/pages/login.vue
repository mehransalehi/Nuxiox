<script setup lang="ts">
import { useToastStore } from '~~/layers/base/app/stores/toast'
import type { UserSession } from '~~/layers/base/types/user-session'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const toastStore = useToastStore()

const session = useUserSession() as {
  user: Ref<UserSession | null>
  fetch?: () => Promise<void>
}

const login = async () => {
  errorMessage.value = null
  loading.value = true

  try {
    const res = await $fetch<{
      success?: boolean
      firstLogin?: boolean
      user: {
        email: string
        role: 'admin' | 'user'
      }
    }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (session.fetch) {
      await session.fetch()
    }

    toastStore.push('Login successful.', 'success')

    if (res.user.role === 'admin') {
      if (import.meta.client) {
        window.location.assign('/admin')
        return
      }
      await navigateTo('/admin', { replace: true })
      return
    }

    await navigateTo('/', { replace: true })
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.message || $t('auth.loginFailed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
        {{ $t('auth.signIn') }}
      </h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
        {{ $t('auth.loginToPanel') }}
      </p>

      <form class="space-y-4" @submit.prevent="login">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.email') }}
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@example.com"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('auth.password') }}
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <div v-if="errorMessage" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">{{ $t('auth.login') }}</span>
          <span v-else class="animate-pulse">{{ $t('auth.signingIn') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
