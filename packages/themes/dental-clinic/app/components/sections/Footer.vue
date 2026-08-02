<script setup lang="ts">
import { Smile, MapPin, Mail, Phone, Heart, ShieldCheck } from 'lucide-vue-next';

const props = defineProps<{
  menus?: { label: string; href: string }[];
  darkLogo?: string;
  lightLogo?: string;
  info?: { key: string; value: string }[];
}>();

const getInfoValue = (keyName: string) => {
  if (!props.info) return '';
  const match = props.info.find(i => i.key.toLowerCase() === keyName.toLowerCase());
  return match ? match.value : '';
};
</script>

<template>
  <footer class="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        <!-- Brand Info -->
        <div class="space-y-4">
          <a href="/" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <Smile class="w-6 h-6 stroke-[2.5]" />
            </div>
            <span class="text-2xl font-bold tracking-tight text-white">
              SmileCraft <span class="text-teal-400 font-extrabold text-xs uppercase tracking-wider bg-teal-950 px-2 py-0.5 rounded border border-teal-800">Dental</span>
            </span>
          </a>
          <p class="text-sm text-slate-400 leading-relaxed">
            Delivering pain-free, state-of-the-art cosmetic, surgical, and preventive dental care backed by board-certified specialists and 3D precision imaging.
          </p>
          <div class="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 p-3 rounded-xl border border-teal-900">
            <ShieldCheck class="w-4 h-4 shrink-0 text-teal-300" />
            <span>ADA Accredited & 100% Digital Scans</span>
          </div>
        </div>

        <!-- Quick Links / Services Navigation -->
        <div>
          <h3 class="text-white text-base font-semibold mb-4 tracking-wide uppercase text-xs font-mono text-teal-400">
            Quick Navigation
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="(item, idx) in (menus || []).slice(0, 6)" :key="idx">
              <a :href="item.href" class="hover:text-teal-400 transition flex items-center gap-1.5">
                <span class="text-teal-500 text-xs">›</span>
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Patient Services -->
        <div>
          <h3 class="text-white text-base font-semibold mb-4 tracking-wide uppercase text-xs font-mono text-teal-400">
            Specialized Care
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="/#services" class="hover:text-teal-400 transition">3D Computer-Guided Implants</a></li>
            <li><a href="/#services" class="hover:text-teal-400 transition">Laser Teeth Whitening</a></li>
            <li><a href="/#services" class="hover:text-teal-400 transition">Invisalign Clear Aligners</a></li>
            <li><a href="/#services" class="hover:text-teal-400 transition">Porcelain Cosmetic Veneers</a></li>
            <li><a href="/emergency-care" class="hover:text-teal-400 transition">24/7 Urgent Care Hotline</a></li>
            <li><a href="/pricing-plans" class="hover:text-teal-400 transition">0% APR Patient Financing</a></li>
          </ul>
        </div>

        <!-- Contact & Hours -->
        <div class="space-y-4">
          <h3 class="text-white text-base font-semibold mb-4 tracking-wide uppercase text-xs font-mono text-teal-400">
            Clinic Contact
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <MapPin class="w-4 h-4 text-teal-400 shrink-0 mt-1" />
              <span>{{ getInfoValue('address') || '742 Medical Plaza, Suite 400, Beverly Hills, CA' }}</span>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-teal-400 shrink-0" />
              <a :href="'tel:' + (getInfoValue('phone') || '+18005557645')" class="hover:text-teal-400 transition">
                {{ getInfoValue('phone') || '+1 (800) 555-7645' }}
              </a>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-teal-400 shrink-0" />
              <span>{{ getInfoValue('email') || 'concierge@smilecraftdental.com' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 SmileCraft Dental Clinic. All Rights Reserved. Nuxiox Theme Architecture.</p>
        <div class="flex items-center space-x-6">
          <a href="/privacy" class="hover:text-slate-300">Privacy Policy</a>
          <a href="/terms" class="hover:text-slate-300">Terms of Service</a>
          <a href="/accessibility" class="hover:text-slate-300">HIPAA Compliance</a>
        </div>
      </div>
    </div>
  </footer>
</template>
