<template>
  <div class="divider" :style="{ marginTop: topMargin ?? margin, marginBottom: bottomMargin ?? margin }"></div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    margin?: string;
    topMargin?: string;
    bottomMargin?: string;
  }>(),
  {
    margin: '0px',
  },
);
</script>

<style scoped>
.divider {
  width: 100%;
  border-top: 1px solid var(--el-border-color);
}
</style>
