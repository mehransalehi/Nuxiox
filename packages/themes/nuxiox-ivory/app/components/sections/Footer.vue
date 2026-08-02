<script setup lang="ts">
import { computed } from 'vue';
import { useSiteSettings, getInfoValue } from '../../composables/useSiteSettings';
import { Sparkles, MapPin, Mail, Phone } from 'lucide-vue-next';

const props = defineProps<{
  menus?: { label: string; href: string }[];
  darkLogo?: string;
  lightLogo?: string;
  info?: { key: string; value: string }[];
}>();

const { settings } = useSiteSettings();

const footerLinks = computed(() => {
  if (props.menus && props.menus.length) return props.menus;
  return settings.value.footer.menus;
});

const address = computed(() => {
  if (props.info?.length) {
    const a = props.info.find(i => i.key === 'address');
    if (a) return a.value;
  }
  return getInfoValue(settings.value, 'address', 'Friedrichstraße 123, 10117 Berlin, Germany');
});

const email = computed(() => {
  if (props.info?.length) {
    const e = props.info.find(i => i.key === 'email');
    if (e) return e.value;
  }
  return getInfoValue(settings.value, 'email', 'ivoryclinic.eu@gmail.com');
});

const phone = computed(() => {
  if (props.info?.length) {
    const p = props.info.find(i => i.key === 'phone');
    if (p) return p.value;
  }
  return getInfoValue(settings.value, 'phone', '+49 30 892 1011');
});

const copyright = computed(() => {
  if (props.info?.length) {
    const c = props.info.find(i => i.key === 'copyright');
    if (c) return c.value;
  }
  return getInfoValue(settings.value, 'copyright', '© 2026 Ivory Clinic. All rights reserved.');
});
</script>

<template>
  <footer class="bg-slate-950 text-white pt-16 pb-8 transition-colors border-t border-slate-900 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <!-- Brand Info & Logo -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-3">
            <img 
              v-if="lightLogo" 
              :src="lightLogo" 
              alt="Ivory Logo"
              class="w-10 h-10 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div v-else class="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
              <Sparkles class="w-5 h-5" />
            </div>

            <div>
              <span class="text-2xl font-black tracking-widest uppercase font-mono text-white">
                IVORY
              </span>
              <span class="block text-[10px] tracking-widest uppercase text-cyan-400 font-semibold -mt-1">
                Dental Clinic
              </span>
            </div>
          </div>

          <div class="space-y-2 text-xs text-slate-400 max-w-sm">
            <p class="flex items-center gap-2">
              <MapPin class="w-3.5 h-3.5 text-[#00C4DF] shrink-0" />
              <span>{{ address }}</span>
            </p>
            <p class="flex items-center gap-2">
              <Phone class="w-3.5 h-3.5 text-[#00C4DF] shrink-0" />
              <span>{{ phone }}</span>
            </p>
            <p class="flex items-center gap-2">
              <Mail class="w-3.5 h-3.5 text-[#00C4DF] shrink-0" />
              <span>{{ email }}</span>
            </p>
          </div>
        </div>

        <!-- Navigation Links Passed From Props -->
        <div class="md:col-span-4 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-widest text-cyan-400">Navigation</h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <a 
              v-for="link in footerLinks" 
              :key="link.href" 
              :href="link.href"
              class="text-slate-400 hover:text-white transition-colors"
            >
              {{ link.label }}
            </a>
          </div>
        </div>

        <!-- Copyright & Legal -->
        <div class="md:col-span-3 space-y-3 text-xs text-slate-500">
          <h4 class="text-xs font-bold uppercase tracking-widest text-cyan-400">Legal</h4>
          <p>{{ copyright }}</p>
          <a href="/warranty" class="block text-slate-400 hover:text-cyan-400">
            Official Warranty & Guarantees
          </a>
        </div>

      </div>

      <!-- Massive Oversized "IVORY" Brand Typography Spanning Full Width (Image 1 replica) -->
      <div class="pt-8 border-t border-slate-900 text-center select-none">
        <h1 class="text-[18vw] font-black tracking-tighter leading-none text-slate-900/80 font-mono hover:text-cyan-950 transition-colors uppercase">
          IVORY
        </h1>
      </div>

    </div>
  </footer>
</template>
