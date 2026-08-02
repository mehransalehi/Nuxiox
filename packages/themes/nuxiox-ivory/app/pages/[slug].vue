<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, defineAsyncComponent, type Component, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutOverrides } from '../composables/useLayoutOverrides';

interface PageBlock {
  uid: string;
  type: 'text' | 'section' | 'navbar' | 'footer';
  sectionId?: string;
  content?: string;
}

interface PageRecord {
  id: number;
  title: string;
  slug: string;
  builder: { version: number; blocks: PageBlock[] } | string;
  seo?: Record<string, any> | string;
}

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const pageData = ref<PageRecord | null>(null);
const isLoading = ref(true);
const isNotFound = ref(false);

const layoutOverrides = useLayoutOverrides();

// Dynamic discovery of theme section components
const modules = import.meta.glob('../components/sections/*.vue');
const components: Record<string, Component> = {};

for (const path in modules) {
  const loader = modules[path];
  if (!loader) continue;
  const fileName = path.split('/').pop();
  if (!fileName) continue;
  const name = fileName.replace('.vue', '');
  components[name] = defineAsyncComponent(() => loader().then((m: any) => m.default));
}

const getSectionComponent = (block: PageBlock) => {
  if (block.sectionId && components[block.sectionId]) {
    return components[block.sectionId];
  }
  return null;
};

const parsedBlocks = computed(() => {
  if (!pageData.value) return [];
  let builder = pageData.value.builder;
  if (typeof builder === 'string') {
    try {
      builder = JSON.parse(builder);
    } catch {
      builder = { version: 1, blocks: [] };
    }
  }
  return (builder as any)?.blocks || [];
});

const loadPage = async () => {
  isLoading.value = true;
  isNotFound.value = false;
  try {
    const res = await fetch(`/api/pages/public/${slug.value}`);
    if (res.ok) {
      pageData.value = await res.json();
      if (pageData.value?.title) {
        document.title = `${pageData.value.title} | Ivory Dental Clinic`;
      }
    } else {
      isNotFound.value = true;
    }
  } catch (e) {
    isNotFound.value = true;
  } finally {
    isLoading.value = false;
  }
};

watch(
  parsedBlocks,
  (blocks) => {
    layoutOverrides.value.hideNavbar = blocks.some((b: PageBlock) => b.type === 'navbar');
    layoutOverrides.value.hideFooter = blocks.some((b: PageBlock) => b.type === 'footer');
  },
  { immediate: true }
);

watch(slug, () => {
  loadPage();
});

onMounted(() => {
  loadPage();
});

onBeforeUnmount(() => {
  layoutOverrides.value.hideNavbar = false;
  layoutOverrides.value.hideFooter = false;
});
</script>

<template>
  <div class="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-[60vh]">
    <div v-if="isLoading" class="text-center py-20 text-slate-500">
      Loading page...
    </div>

    <div v-else-if="isNotFound" class="text-center py-20 space-y-4">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
      <p class="text-slate-500">The requested page could not be located.</p>
      <a href="/" class="inline-block px-6 py-2.5 rounded-full bg-[#00C4DF] text-white font-semibold text-sm">
        Return Home
      </a>
    </div>

    <div v-else class="space-y-12">
      <template v-for="block in parsedBlocks" :key="block.uid">
        <div v-if="block.type === 'text'" class="prose dark:prose-invert max-w-none" v-html="block.content"></div>
        <component v-else-if="getSectionComponent(block)" :is="getSectionComponent(block)" />
      </template>
    </div>
  </div>
</template>
