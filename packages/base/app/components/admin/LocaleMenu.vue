<script setup lang="ts">
import { type MenuItem } from '~~/packages/base/utils/settings'

const { locales } = useI18n()

const props = defineProps<{
  modelValue: MenuItem[]
  locale: string
  handler: string
}>()

const emit = defineEmits(['update:modelValue', 'update:locale'])

const editingLocale = computed({
  get: () => props.locale,
  set: (val) => emit('update:locale', val),
})

const localeOptions = computed(() =>
  locales.value.map((cur: any) => ({
    key: cur.name as string,
    value: cur.code as string,
  }))
)

// Proxy the modelValue to AdminMenuCreator via v-model
// AdminMenuCreator emits 'update' with the new array
const onMenuUpdate = (menus: MenuItem[]) => {
  emit('update:modelValue', menus)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium opacity-70">{{ $t('common.language') }}</label>
      <select
        v-model="editingLocale"
        class="select select-bordered select-sm max-w-36"
      >
        <option
          v-for="opt in localeOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.key }}
        </option>
      </select>
    </div>
    <AdminMenuCreator
      :key="`${handler}-${editingLocale}`"
      :list="modelValue"
      :handler="handler"
      @update="onMenuUpdate"
    />
  </div>
</template>