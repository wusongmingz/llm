<template>
  <div class="app-main-box">
    <router-view v-slot="{ Component }">
      <keep-alive :include="themeStore.cacheMenuList">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
const themeStore = useThemeStore();
</script>

<style lang="scss" scoped>
.app-main-box {
  width: 100%;
  padding: 10px;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
  // background-color: var(--layout-bg-color);
  transition: background-color var(--el-transition-duration);
}
</style>
