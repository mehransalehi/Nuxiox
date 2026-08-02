<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-vue-next';

const name = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const preferredDate = ref('');
const serviceId = ref('General Consultation & Exam');
const message = ref('');

const submitting = ref(false);
const successData = ref<{ message: string; ticketId: string } | null>(null);
const errorMessage = ref('');

const submitAppointment = async () => {
  if (!name.value || !email.value || !message.value) {
    errorMessage.value = 'Please complete your name, email, and reason for visit.';
    return;
  }

  try {
    submitting.value = true;
    errorMessage.value = '';
    const res = await fetch('/api/contact-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        preferredDate: preferredDate.value,
        serviceId: serviceId.value,
        subject: `Appointment Booking: ${serviceId.value}`,
        message: message.value
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      successData.value = { message: data.message, ticketId: data.ticketId };
      name.value = '';
      email.value = '';
      phone.value = '';
      address.value = '';
      preferredDate.value = '';
      message.value = '';
    } else {
      errorMessage.value = data.message || 'Failed to send message. Please try calling us directly.';
    }
  } catch (err) {
    errorMessage.value = 'Network error. Please call our clinic at +1 (800) 555-SMILE.';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section id="contact" class="py-20 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- Clinic Info Box -->
        <div class="lg:col-span-5 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Calendar class="w-4 h-4" />
            <span>Book Your Appointment</span>
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready for a Brighter, Healthier Smile?
          </h2>

          <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Fill out the form to request your preferred date and time. Our patient concierge will contact you within 2 business hours to finalize your reservation.
          </p>

          <div class="space-y-4 pt-2">
            <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <MapPin class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">Clinic Location</h4>
                <p class="text-xs text-slate-600 dark:text-slate-400">742 Medical Plaza, Suite 400, Beverly Hills, CA</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Phone class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">Phone Hotline</h4>
                <p class="text-xs text-slate-600 dark:text-slate-400">+1 (800) 555-SMILE / +1 (800) 555-7645</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Clock class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">Clinic Hours</h4>
                <p class="text-xs text-slate-600 dark:text-slate-400">Monday - Saturday: 8:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Form -->
        <div class="lg:col-span-7 bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <!-- Success Alert -->
          <div v-if="successData" class="p-6 bg-teal-900 text-white rounded-2xl space-y-3 border border-teal-700 animate-fadeIn">
            <div class="flex items-center gap-3">
              <CheckCircle2 class="w-8 h-8 text-teal-300 shrink-0" />
              <div>
                <h3 class="text-xl font-bold text-white">Appointment Request Received!</h3>
                <p class="text-xs text-teal-200 font-mono">Confirmation Reference: {{ successData.ticketId }}</p>
              </div>
            </div>
            <p class="text-sm text-teal-100 leading-relaxed">{{ successData.message }}</p>
            <button 
              @click="successData = null" 
              class="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition"
            >
              Book Another Appointment
            </button>
          </div>

          <form v-else @submit.prevent="submitAppointment" class="space-y-5">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Online Reservation Form</h3>

            <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input 
                  v-model="name"
                  type="text" 
                  placeholder="e.g. Sarah Jenkins"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="sarah@example.com"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input 
                  v-model="phone"
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Preferred Date</label>
                <input 
                  v-model="preferredDate"
                  type="date" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Desired Service</label>
              <select 
                v-model="serviceId"
                class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              >
                <option>General Consultation & Exam</option>
                <option>Laser Teeth Whitening</option>
                <option>Computer-Guided Dental Implants</option>
                <option>Porcelain Veneers & Smile Redesign</option>
                <option>Invisalign Clear Aligners</option>
                <option>Painless Root Canal Therapy</option>
                <option>Urgent Toothache / Emergency Care</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Notes or Special Requirements *</label>
              <textarea 
                v-model="message"
                rows="4" 
                placeholder="Tell us about any specific symptoms, cosmetic goals, or anxiety preferences..."
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="submitting"
              class="w-full py-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-600/30 transition duration-200 flex items-center justify-center gap-2"
            >
              <Send class="w-5 h-5" />
              <span>{{ submitting ? 'Submitting Reservation...' : 'Confirm Appointment Request' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
