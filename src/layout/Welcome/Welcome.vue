<template>
  <div class="welcome-bg">
    <div class="welcome-box">
      <img class="welcome-img" src="@/assets/image/public/welcome.png" alt="" srcset="" />
      <div>欢迎使用虚拟电厂运营管理云平台</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Welcome',
});
</script>

<style scoped>
.welcome-bg {
  background-color: var(--layout-menu-bg-color);
  width: 100%;
  height: 100%;
  position: relative;
}
.welcome-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 440px;
  font-size: 26px;
}
.welcome-img {
  width: 462px;
  height: 347px;
}
</style>
