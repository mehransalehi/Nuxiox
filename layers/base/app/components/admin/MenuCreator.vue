<script setup lang="ts">
const props = defineProps<{
  list: { label: String, href: String }[]
  handler : string
}>()
const emit = defineEmits(['update'])

const draggingMenu = ref<{ section: string; index: number } | null>(null)
const myList = ref(props.list)


const reorderMenus = (section: string, fromIndex: number, toIndex: number) => {
  const menus = myList.value
  const [moved] = menus.splice(fromIndex, 1)
  if (moved)
    menus.splice(toIndex, 0, moved)

  emit('update', myList.value)
}

const addToList = () => {
  myList.value.push({ label: '', href: '' });
  emit('update', myList.value)
}
const removeFromList = (index: number) => {
  myList.value.splice(index, 1);
  emit('update', myList.value)
}

const handleDragStart = (section: string, index: number) => {
  draggingMenu.value = { section, index }
}

const resetDrag = () => {
  draggingMenu.value = null
}

const handleDrop = (section: string, index: number) => {
  if (!draggingMenu.value) return
  if (draggingMenu.value.section !== section) return
  const fromIndex = draggingMenu.value.index
  const toIndex = index
  if (fromIndex !== toIndex) {
    reorderMenus(section, fromIndex, toIndex)
  } else {
    emit('update', myList.value)
  }
  draggingMenu.value = null

}


</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold">{{ $t('common.menus') }}</h4>
      <button class="btn btn-sm" @click="addToList">{{ $t('common.addMenu') }}</button>
    </div>
    <div v-for="(menu, index) in myList" :key="`navbar-menu-${index}`"
      class="grid gap-3 md:grid-cols-[auto_1fr_1fr_auto]" draggable="true" @dragstart="handleDragStart(props.handler, index)"
      @dragend="resetDrag" @dragover.prevent @drop="handleDrop('navbar', index)">
      <button class="btn btn-ghost btn-square cursor-grab" type="button"
        :aria-label="$t('common.dragToReorder') as any">
        <i class="fa-solid fa-grip-vertical" aria-hidden="true" />
      </button>
      <input v-model="menu.label" class="input input-bordered" type="text" :placeholder="$t('common.label') as any" />
      <input v-model="menu.href" class="input input-bordered" type="text"
        :placeholder="$t('common.pathPlaceholder') as any" />
      <button class="btn btn-ghost btn-square" @click="removeFromList(index)">✕</button>
    </div>
  </div>
</template>