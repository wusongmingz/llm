<template>
  <div class="layout">
    <div class="top-bar"><TopBar /></div>
    <div class="app">
      <div v-if="themeStore.menuMode === 'vertical' && route.path != '/home'" class="app-sidebar" id="side-bar">
        <Menu />
      </div>
      <div class="app-container">
        <!-- <TabBar v-if="!themeStore.isSmallDevice" /> -->
        <AppMain class="app-main" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from './TopBar/TopBar.vue';
import Menu from './Menu/Menu.vue';
import TabBar from './TabBar/TabBar.vue';
import AppMain from './AppMain/AppMain.vue';
import { watch } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { useMediaQuery } from './hook/useMediaQuery';
import { useRoute } from 'vue-router';
const themeStore = useThemeStore();
const route = useRoute();
// 监控媒体查询类型，并将其保存到全局状态中
const { screenRef } = useMediaQuery();
watch(screenRef, (val) => {
  themeStore.mediaQuery = val;
});
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  // background-color: var(--layout-bg-color);
  background: url('@/assets/image/home/home.png') no-repeat;
  background-size: cover;
}
.top-bar {
  width: 100%;
  // border-radius: 10px 10px 0 0;
  // box-shadow: 0px 0px 10px rgb(0, 0, 0, 0.15);
  background-color: var(--layout-topbar-bg);
}
.app {
  width: 100%;
  display: flex;

  height: calc(100% - var(--layout-topbar-height));
  // background-color: var(--layout-bg-color);
  .app-sidebar {
    padding-top: 10px;
  }
  .app-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    .app-main {
      flex: 1;
      &::-webkit-scrollbar {
        width: 0; /* 隐藏滚动条 */
      }
    }
  }
}
</style>
