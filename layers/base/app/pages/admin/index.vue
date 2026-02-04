<template>
    <div>
        <h1 class="bg-green-500 text-white p-4 text-8xl font-bold">Welcome {{ user ? user.email : 'NONE' }}</h1>
        <button @click="logout">
            Logout
        </button>
    </div>
</template>
<script setup lang="ts">
import type { UserSession } from '~~/layers/base/types/user-session';
definePageMeta({
    middleware: ['authenticated'],
})
const { user, clear: clearSession } = useUserSession() as { user: Ref<UserSession | null>, clear: any }

async function logout() {
    await clearSession()
    await navigateTo('/login')
}
</script>