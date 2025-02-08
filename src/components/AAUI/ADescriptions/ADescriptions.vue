<template>
  <el-descriptions :column="column" border>
    <el-descriptions-item v-for="item in list" :key="item.prop" label-align="right" align="center" v-bind="item">
      <template #label>
        <slot :name="item.prop + '-label'" :data="item"
          ><span class="descriptions-label">{{ item.label }}</span></slot
        >
      </template>
      <slot :name="item.prop" :data="item">{{ data[item.prop] }}</slot>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { IDescriptions } from './types/descriptions';
withDefaults(
  defineProps<{
    data: any;
    list: IDescriptions[];
    column?: number;
  }>(),
  {
    column: 3,
  },
);
</script>

<style scoped>
.descriptions-label {
  font-weight: bold;
  white-space: nowrap;
}
</style>
