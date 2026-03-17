<script setup lang="ts">
const props = defineProps<{
  list: { key: String, value: String }[],
  title?:String,
  buttonText?:String,
}>()
const emit = defineEmits(['update'])

const myList = ref(props.list)

const addToList = () => {
  myList.value.push({ key: '', value: '' });
  emit('update', myList.value)

}
const removeFromList = (index: number) => {
  myList.value.splice(index, 1);
  emit('update', myList.value)
}



</script>
<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold">{{ props.title ? props.title : $t('common.infoList') }}</h4>
      <button class="btn btn-sm" @click="addToList">{{ props.buttonText ? props.buttonText : $t('common.addInfo') }}</button>
    </div>
    <div v-for="(item, index) in myList" :key="`${index}`"
      class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <input v-model="item.key" class="input input-bordered" type="text" :placeholder="$t('common.label') as any" />
      <input v-model="item.value" class="input input-bordered" type="text"
        :placeholder="$t('common.pathPlaceholder') as any" />
      <button class="btn btn-ghost btn-square" @click="removeFromList(index)">✕</button>
    </div>
  </div>
</template>