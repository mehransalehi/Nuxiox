<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  placeholder?: string
  mediaPicker?: boolean
}>(), {
  mediaPicker: false,
})
const model = defineModel<string>()

const mediaModal = ref<any>(null)

function openMediaPicker() {
  mediaModal.value?.open()
}

function onMediaSelected(media: any) {
  model.value = `/api/admin/media/${media.id}/file`
}
</script>
<template>
  <label class="form-control">
    <span v-if="label" class="label-text">{{ label }}</span>
    <div class="flex gap-2">
      <input
        type="url"
        class="input input-bordered w-full"
        v-model="model"
        :placeholder="placeholder"
      />
      <button
        v-if="mediaPicker"
        type="button"
        class="btn btn-outline btn-square"
        @click="openMediaPicker"
        title="Select from media library"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </button>
    </div>
    <img
      v-if="mediaPicker && model"
      :src="model"
      class="mt-2 h-20 w-20 rounded-lg border object-cover"
      alt="preview"
    />
    <AdminMediaLibraryPicker ref="mediaModal" @select="onMediaSelected" />
  </label>
</template>