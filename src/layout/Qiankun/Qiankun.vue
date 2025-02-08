<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadMicroApp } from 'qiankun';
const props = defineProps<{
  name: string;
  entry: string;
}>();
const container = ref();
onMounted(() => {
  loadMicroApp({
    name: props.name,
    entry: props.entry,
    container: container.value,
  });
});
</script>

<template>
  <div class="qiankun" ref="container"></div>
</template>

<style scoped lang="scss">
.qiankun {
  width: 100%;
  height: 100%;
}
</style>
