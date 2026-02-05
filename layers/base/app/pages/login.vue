<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

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

    // Redirect based on role
    if (res.user.role === 'admin') {
      await refreshNuxtData()
await nextTick()
      navigateTo('/admin')
    } else {
      navigateTo('/')
    }
  } catch (err: any) {
    errorMessage.value =
      err?.data?.statusMessage ||
      err?.message ||
      'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
        Sign in
      </h1>
      <p class="text-sm text-gray-500 mb-6 text-center">
        Login to your admin panel
      </p>

      <form @submit.prevent="login" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input v-model="email" type="email" required placeholder="admin@example.com" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input v-model="password" type="password" required placeholder="••••••••" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ errorMessage }}
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="loading" class="w-full flex justify-center items-center rounded-lg
                 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                 px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="!loading">Login</span>
          <span v-else class="animate-pulse">Signing in…</span>
        </button>
      </form>
    </div>
  </div>
</template>
