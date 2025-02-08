<template>
  <el-tabs v-model="activeName" type="card" @tab-remove="onRemoveHandle" @tab-click="tabClick">
    <el-tab-pane
      v-for="item in themeStore.tabList"
      :key="item.prop"
      :label="item.title"
      :prop="item.prop"
      :name="item.name"
      :closable="item.closable"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { TabPaneName } from 'element-plus';
import { useThemeStore } from '@/store/modules/theme';

const activeName = ref('first');
const route = useRoute();
const router = useRouter();
const { userInfo } = useUserStore();
const themeStore = useThemeStore();
themeStore.tabList = [
  { title: userInfo.title, prop: userInfo.homePath, name: userInfo.homeName, closable: false, componentName: userInfo.componentName },
];

watch(
  route,
  (val) => {
    let flag = true;
    for (const iterator of themeStore.tabList) {
      if (iterator.name === val.name) {
        iterator.prop = val.fullPath;
        flag = false;
        break;
      }
    }
    if (flag) {
      themeStore.tabList.push({
        title: val.meta.title?.toString() || '',
        prop: val.fullPath,
        name: val.name?.toString() || '',
        closable: true,
        componentName: val.meta.componentName?.toString() || '',
      });
    }
    activeName.value = val.name?.toString() || '';
  },
  { immediate: true },
);

const onRemoveHandle = (tabName: TabPaneName) => {
  for (let i = 0; i < themeStore.tabList.length; i++) {
    if (themeStore.tabList[i].name === tabName) {
      if (route.name === tabName) {
        router.push(themeStore.tabList[i === 0 ? 1 : i - 1].prop);
      }
      themeStore.tabList.splice(i, 1);
      break;
    }
  }
};

const tabClick = (tabName: any) => {
  router.push((themeStore.tabList as any)[tabName.index].prop);
};
</script>

<style lang="scss" scoped>
.el-tabs {
  height: var(--layout-tabbar-height);
  background-color: var(--layout-tabbar-bg-color);
  transition: background-color var(--el-transition-duration);
  overflow: hidden;
  --el-tabs-header-height: var(--layout-tabbar-height);
  --el-border-color-light: var(--layout-bg-color);
  :deep(.el-tabs__header) {
    transition: border var(--el-transition-duration) !important;
    border-width: 2px !important;
  }
  :deep(.el-tabs__nav) {
    border-width: 2px !important;
    transition: border var(--el-transition-duration) !important;
    border-radius: 0 !important;
  }
  :deep(.el-tabs__item) {
    border-width: 2px !important;
    transition: border var(--el-transition-duration), color var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier),
      padding var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier) !important;
  }
  :deep(.el-tabs__nav-next),
  :deep(.el-tabs__nav-prev) {
    line-height: 54px;
  }
  :deep(.el-tabs__content) {
    display: none;
  }
}
</style>
