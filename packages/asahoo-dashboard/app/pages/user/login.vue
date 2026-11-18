<script setup lang="ts">
definePageMeta({ layout: 'default' })

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/user/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    window.location.href = '/user'
  } catch (e: any) {
    error.value = e?.data?.message || 'خطا در ورود'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body p-8">
        <h1 class="text-2xl font-bold text-center mb-6">ورود به داشبورد کاربری</h1>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ایمیل</label>
            <input v-model="email" type="email" required class="input input-bordered w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">رمز عبور</label>
            <input v-model="password" type="password" required class="input input-bordered w-full" />
          </div>
          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <button type="submit" :disabled="loading" class="btn btn-primary w-full">
            {{ loading ? '...' : 'ورود' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>