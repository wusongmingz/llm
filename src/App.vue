<template>
  <el-config-provider :locale="zhCn">
    <router-view v-loading="userStore.fullscreenLoading.show" :element-loading-text="userStore.fullscreenLoading.text" />
  </el-config-provider>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { useUserStore } from './store/modules/user';
const userStore = useUserStore();
const bodyScale = () => {
  const devicewidth = document.documentElement.clientWidth + 8; //获取当前分辨率下的可是区域宽度
  // console.log(devicewidth);
  const scale = devicewidth / 1920; // 分母——设计稿的尺寸
  // document.body.style.transform = 'scale(' + scale + ')'; //放大缩小相应倍数
  // document.body.style.transformOrigin = 'top left';

  const el = document.getElementById('app');

  // el.style.zoom = scale;
  el.style.transform = 'scale(' + scale + ')'; //放大缩小相应倍数
  el.style.transformOrigin = 'top left';
  // document.body.style.zoom = scale;
  el.style.height = 100 / scale + 'vh';
  el.style.width = 100 / scale + 'vw';
};
bodyScale();
window.addEventListener('resize', function () {
  // 在这里重新计算布局或执行其他操作
  bodyScale();
});
</script>
