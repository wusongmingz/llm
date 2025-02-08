<template>
  <div class="error-box">
    <el-icon class="error-img" :size="200"><CircleClose /></el-icon>
    <div>{{ userStore.errorPageMessage }}</div>
    <div>
      <el-button @click="backToHome" :type="'primary'">返回首页</el-button>
      <el-button @click="logoutHandle" :type="'danger'">退出登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const router = useRouter();
const backToHome = () => {
  router.push('/');
};
const logoutHandle = () => {
  userStore.logout().finally(() => {
    router.push('/login');
  });
};
</script>

<style scoped>
.error-box {
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
.error-img {
  width: 200px;
  height: 200px;
}
</style>
