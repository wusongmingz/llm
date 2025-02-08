<template>
  <el-drawer
    class="menu-deawer"
    :direction="'ltr'"
    :with-header="false"
    :size="menuWidth"
    v-model="themeStore.isExpand"
    v-if="themeStore.isSmallDevice || themeStore.hideMenu"
  >
    <div class="logo-icon-box">
      <img class="logo-icon" src="../../assets/logo.png" alt="" />
    </div>
    <MenuBar class="fold-menu" />
  </el-drawer>
  <MenuBar v-else class="expand-menu" />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import MenuBar from './components/MenuBar.vue';
const themeStore = useThemeStore();
import { useCssVar } from '@vueuse/core';
const menuWidth = useCssVar('--layout-menu-width');
</script>

<style lang="scss">
.menu-deawer {
  .el-drawer__body {
    padding: 0 !important;
  }
  .logo-icon-box {
    height: 60px;
    background-color: #0051b1;
    line-height: 60px;
    .logo-icon {
      height: 40px;
      margin: 10px 20px;
    }
  }
  .fold-menu {
    height: calc(100% - 60px);
  }
}
.expand-menu {
  height: 100%;
}
</style>
