<script setup lang="ts">
const { color, top, left, bottom, right } = defineProps<{
  color: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}>();
const emit = defineEmits<{
  (e: 'pageClick', method: 'prev' | 'next'): void;
}>();
</script>

<template>
  <div class="page-indicator" :style="{ left, top, bottom, right }">
    <el-icon class="page-indicator-item" :size="30" :color="color" @click="emit('pageClick', 'prev')"> <MIcon icon="icon-houtui2" /> </el-icon>
    <el-icon class="page-indicator-item" :size="30" :color="color" @click="emit('pageClick', 'next')"> <MIcon icon="icon-qianjin1" /> </el-icon>
  </div>
</template>

<style scoped lang="scss">
.page-indicator {
  position: absolute;
  width: 120px;
  display: flex;
  justify-content: space-between;
  .page-indicator-item {
    transition: background-color 0.3s;
    border-radius: 15px;
    cursor: pointer;
  }
  .page-indicator-item:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transition: background-color 0.3s;
  }
}
</style>
