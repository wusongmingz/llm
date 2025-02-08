<template>
  <div class="notfound-box">
    <el-icon class="notfound-img" :size="200"><FolderDelete /></el-icon>
    <div>请检查：</div>
    <div>1. 该账号是否设置主页</div>
    <div>2. 该账号是否有该主页权限</div>
    <div>3. 主页路由设置错误</div>
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
