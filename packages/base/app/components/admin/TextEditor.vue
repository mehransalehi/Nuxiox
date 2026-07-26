<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement | null>(null)

const updateContent = () => {
  emit('update:modelValue', editorRef.value?.innerHTML ?? '')
}

const exec = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  updateContent()
}

const createLink = () => {
  const url = prompt('Enter link URL')
  if (url) exec('createLink', url)
}

const insertImage = () => {
  const url = prompt('Enter image URL')
  if (url) exec('insertImage', url)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorRef.value) return
    if (editorRef.value.innerHTML !== value) {
      editorRef.value.innerHTML = value
    }
  }
)

onMounted(() => {
  if (editorRef.value) editorRef.value.innerHTML = props.modelValue
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-xs" type="button" @click="exec('bold')">Bold</button>
      <button class="btn btn-xs" type="button" @click="exec('italic')">Italic</button>
      <button class="btn btn-xs" type="button" @click="exec('underline')">Underline</button>
      <button class="btn btn-xs" type="button" @click="exec('insertUnorderedList')">List</button>
      <button class="btn btn-xs" type="button" @click="createLink">Link</button>
      <button class="btn btn-xs" type="button" @click="insertImage">Image</button>
    </div>
    <div
      ref="editorRef"
      class="min-h-[10rem] rounded-lg border border-base-300 bg-base-100 p-3 focus:outline-none"
      contenteditable="true"
      @input="updateContent"
    />
  </div>
</template>
