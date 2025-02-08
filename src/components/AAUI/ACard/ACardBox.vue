<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    direction?: 'row' | 'column';
  }>(),
  {
    direction: 'column',
  },
);
</script>

<template>
  <div :class="'a-card-box-' + props.direction">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.a-card-box-column {
  :deep(> *) {
    margin-bottom: 10px;
  }
  :deep(> :last-child) {
    margin-bottom: 0;
  }
}
.a-card-box-row {
  display: flex;
  width: 100%;
  :deep(> *) {
    margin-right: 10px;
  }
  :deep(> :last-child) {
    margin-right: 0;
  }
}
</style>
