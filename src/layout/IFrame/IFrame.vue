<script setup lang="ts">
import { StyleValue, ref } from 'vue';

const prop = defineProps<{
  url: string;
  style?: StyleValue;
}>();

const iframeElement = ref();
defineExpose({ iframeElement });
</script>

<template>
  <div class="micro-app-iframe">
    <iframe class="app-iframe" ref="iframeElement" :style="prop.style" :src="prop.url" frameborder="0"></iframe>
  </div>
</template>

<style scoped lang="scss">
.micro-app-iframe {
  width: 100%;
  height: 100%;
  .app-iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
