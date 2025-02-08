<template>
  <template v-for="menuItem in menuList">
    <el-menu-item :key="menuItem.name" v-if="!(menuItem.children && menuItem.children.length > 0) && !menuItem.meta?.hidden" :index="menuItem.path">
      <el-icon> <AIcon :icon="menuItem.meta?.icon ?? ''" /> </el-icon>
      <template #title>{{ menuItem.meta?.title }}</template>
    </el-menu-item>
    <el-sub-menu :key="menuItem.name" v-if="menuItem.children && menuItem.children.length > 0 && !menuItem.meta?.hidden" :index="menuItem.path">
      <template #title>
        <el-icon> <AIcon :icon="menuItem.meta?.icon || ''" /> </el-icon>
        <span>{{ menuItem.meta?.title }}</span>
      </template>
      <MenuItem :menuList="menuItem.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';

defineProps<{
  menuList: RouteRecordRaw[];
}>();
</script>
