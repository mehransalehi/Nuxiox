<script setup lang="ts">
interface NavItem {
  to: string
  label: string
  icon?: string
}

defineProps<{
  collapsed: boolean
  userEmail?: string | null
}>()

const emit = defineEmits<{
  logout: []
}>()

const { t } = useI18n()

const sections = computed<{ title: string; items: NavItem[] }[]>(() => [
  {
    title: t('admin.sidebar.main'),
    items: [
      { to: '/admin', label: t('admin.sidebar.dashboard'), icon: 'fa-solid fa-gauge' },
    ],
  },
  {
    title: t('admin.sidebar.management'),
    items: [
      { to: '/admin/settings', label: t('admin.sidebar.settings'), icon: 'fa-solid fa-gear' },
    ],
  },
])
</script>

<template>
  <aside class="h-full border-base-300 bg-base-100 text-base-content ltr:border-r rtl:border-l">
    <div class="flex h-full flex-col gap-6 p-3">
      <div class="flex items-center gap-3 px-2 pt-2">
        <div class="avatar placeholder">
          <div class="h-10 w-10 rounded-xl bg-primary text-primary-content flex justify-center items-center">
            <i class="fa-solid fa-user-shield" aria-hidden="true" />
          </div>
        </div>
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="font-bold leading-5">{{ t('admin.sidebar.adminPanel') }}</p>
          <p class="text-xs opacity-60">{{ t('admin.sidebar.baseLayer') }}</p>
        </div>
      </div>

      <div class="space-y-4 overflow-y-auto">
        <AdminSidebarSection
          v-for="section in sections"
          :key="section.title"
          :title="section.title"
          :items="section.items"
          :collapsed="collapsed"
        />
      </div>

      <div class="mt-auto border-t border-base-300 pt-3">
        <p v-if="!collapsed" class="mb-2 truncate px-3 text-xs opacity-60">{{ userEmail }}</p>
        <button
          class="btn btn-ghost w-full justify-start text-error hover:bg-error/10"
          type="button"
          @click="emit('logout')"
        >
          <i class="fa-solid fa-right-from-bracket w-4 text-center" aria-hidden="true" />
          <span v-if="!collapsed">{{ t('admin.sidebar.logout') }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
