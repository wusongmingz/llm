<template>
  <div class="notfound-box">
    <el-icon class="notfound-img" :size="200"><FolderDelete /></el-icon>
    <div>404: 你访问的页面不见啦！</div>
  </div>
</template>

<script setup lang="ts">
import { FolderDelete } from '@element-plus/icons-vue';
</script>

<style scoped>
.notfound-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  font-size: 24px;
}
.notfound-img {
  width: 200px;
  height: 200px;
}
</style>
