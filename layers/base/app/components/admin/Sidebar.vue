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



const sections = computed(() => [
  {
    title: $t('admin.sidebar.main'),
    items: [
      { to: '/admin', label: $t('admin.sidebar.dashboard'), icon: 'fa-solid fa-gauge' },
    ],
  },
  {
    title: $t('admin.sidebar.management'),
    items: [
      { to: '/admin/settings', label: $t('admin.sidebar.settings'), icon: 'fa-solid fa-gear' },
      { to: '/admin/home-builder', label: $t('admin.sidebar.homeBuilder'), icon: 'fa-solid fa-layer-group' },
      { to: '/admin/pages', label: $t('admin.sidebar.pages'), icon: 'fa-solid fa-file-lines' },
      { to: '/admin/blog', label: $t('admin.sidebar.blog'), icon: 'fa-solid fa-blog' },
      { to: '/admin/blog/categories', label: $t('admin.sidebar.blogCategories'), icon: 'fa-solid fa-tags' },
      { to: '/admin/blog/posts', label: $t('admin.sidebar.blogPosts'), icon: 'fa-solid fa-newspaper' },
      { to: '/admin/blog/comments', label: $t('admin.sidebar.blogComments'), icon: 'fa-solid fa-comments' },
      { to: '/admin/services', label: $t('admin.sidebar.services'), icon: 'fa-solid fa-briefcase' },
      { to: '/admin/colleagues', label: $t('admin.sidebar.colleagues'), icon: 'fa-solid fa-user-group' },
      { to: '/admin/testimonials', label: $t('admin.sidebar.testimonials'), icon: 'fa-solid fa-quote-left' },
      { to: '/admin/contact-messages', label: $t('admin.sidebar.contactMessages'), icon: 'fa-solid fa-envelope' },
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
          <p class="font-bold leading-5">{{ $t('admin.sidebar.adminPanel') }}</p>
          <p class="text-xs opacity-60">{{ $t('admin.sidebar.baseLayer') }}</p>
        </div>
      </div>

      <div class="space-y-4 overflow-y-auto">
        <AdminSidebarSection
          v-for="(section,index) in sections"
          :key="index"
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
          <span v-if="!collapsed">{{ $t('admin.sidebar.logout') }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
