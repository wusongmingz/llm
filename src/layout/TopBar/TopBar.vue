<template>
  <div class="top-bar">
    <div class="top-bar-title">
      <el-icon class="expand-icon" @click="themeStore.isExpand = !themeStore.isExpand" v-if="themeStore.isSmallDevice || themeStore.hideMenu">
        <Expand />
      </el-icon>
      <img v-if="!themeStore.isSmallDevice" class="logo-icon" src="../../assets/logo.png" alt="" />
      <!-- <div v-if="themeStore.mediaQuery !== 'XS'" class="logo-title ellipsis">{{ title }}</div> -->
    </div>
    <!-- <div class="top-bar-menu">
      <Menu v-if="themeStore.menuMode === 'horizontal'" />
    </div> -->
    <div class="top-bar-user">
      <!-- <el-switch
        class="user-dark"
        v-model="isDark"
        inline-prompt
        :inactive-icon="() => h(ElIcon, { color: 'black', size: 16 }, () => h(Sunny))"
        :active-icon="MoonNight"
        @click="toggleDark($event)"
      />
      <el-badge class="user-message" @click="router.push('/message')" :value="0">
        <el-icon :size="25"><BellFilled /></el-icon>
        <span v-if="!themeStore.isSmallDevice" class="ellipsis">消息</span>
      </el-badge> -->
      <el-dropdown popper-class="user-dropdown" :teleported="true" v-if="isShow1 == 1">
        <div class="user-info">
          <img class="user-avatar" v-if="sysUser?.avatar" :src="sysUser?.avatar" />
          <img class="user-avatar" v-else src="@/assets/image/home/icon-morentouxiang.svg" />
          <!-- <div v-if="!themeStore.isSmallDevice" class="user-name ellipsis">{{ userStore.sysUser?.name }}</div> -->
          <div v-if="!themeStore.isSmallDevice" class="user-name ellipsis">{{ sysUser?.name }}</div>
          <el-icon v-if="!themeStore.isSmallDevice" class="el-icon--right">
            <!-- <arrow-down /> -->
            <AIcon icon="icon-xiangxiajiantou" />
          </el-icon>
        </div>
        <template #dropdown>
          <!-- <div class="user-dropdown-info">
            <img v-if="sysUser?.avatar" :src="sysUser?.avatar" />
            <img v-else src="@/assets/image/home/icon-morentouxiang.svg" />
            {{ sysUser?.name }}
          </div> -->
          <el-dropdown-menu>
            <!-- <el-dropdown-item :icon="Edit">资料设置</el-dropdown-item>
            <el-dropdown-item :icon="Lock">修改密码</el-dropdown-item> -->
            <!-- <el-dropdown-item :icon="() => h(AIcon, { icon: 'icon-kongzhitai' })" @click="goDashboard">返回控制台</el-dropdown-item> -->
            <el-dropdown-item @click="handleClick(1)">
              <el-icon size="20"> <AIcon icon="icon-yonghu" /> </el-icon>用户信息
            </el-dropdown-item>
            <el-dropdown-item @click="handleClick(2)">
              <el-icon size="20"> <AIcon icon="icon-jizhang" /> </el-icon>Token消耗
            </el-dropdown-item>
            <el-dropdown-item @click="handleClick(3)">
              <el-icon size="20"> <AIcon icon="icon-chanpinwendang" /> </el-icon>AI产品文档
            </el-dropdown-item>
            <el-dropdown-item @click="logoutHandle">
              <el-icon size="20"> <AIcon icon="icon-tuichudenglu" /> </el-icon>退出登陆
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-else class="top-bar-user-no" @click="jumpRouterHome(2)">
        <el-icon class="top-bar-user-no-img" size="25">
          <!-- <arrow-down /> -->
          <AIcon icon="icon-dengluzhanghao" />
        </el-icon>
        <div class="top-bar-user-no-text">登录</div>
      </div>
    </div>
  </div>
  <ADialog :title="'重置密码'" v-model:isShow="isShowEditDialog" @submit="editSubmit()">
    <AForm ref="editFormRef" v-loading="editFormLoading" :list="editFormList" :data="editFormData" :column="1" :rules="editFormRules">
      <template #pwdLevel>
        <ul class="pwd-strong">
          <li :class="{ weak: pwdLevel === 0 }">弱</li>
          <li :class="{ better: pwdLevel === 1 }">中</li>
          <li :class="{ strong: pwdLevel === 2 }">强</li>
        </ul>
      </template>
    </AForm>
  </ADialog>
</template>

<script setup lang="ts">
import { h, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { ArrowDown, BellFilled, SwitchButton, Expand, MoonNight, Sunny, Setting } from '@element-plus/icons-vue';
import { useThemeStore } from '@/store/modules/theme';
import { useUserStore } from '@/store/modules/user';
import { useDarkMode } from './hook/useDark';
import { useEdit } from './hook/useEdit';
import avatar from '@/assets/image/home/icon-morentouxiang.svg';
const { pwdLevel, editFormRef, editFormList, editFormData, editHandleSync, editFormLoading, editFormRules, isShowEditDialog } = useEdit();

//跳转使用指南
const jumpRouterHome = (status: number) => {
  if (status == 2) {
    router.push({ name: '/login' });
  } else {
    userStore.sysStatus = status; //退出登录
    router.push({ name: '/home' });
    userStore.sysUser = undefined;
  }
};

const circleUrl = avatar;
const title = import.meta.env.VITE_TITLE;

// theme
const themeStore = useThemeStore();
const { isDarkUnset: isDark, toggleDark } = useDarkMode();

// user infomation
const userStore = useUserStore();
const router = useRouter();

const isShow1 = computed(() => userStore.sysStatus);
const sysUser = computed(() => userStore.sysUser);

const handleClick = (type: number) => {
  if (type === 1) {
    router.push({ name: '/UserInformation' });
  } else if (type === 2) {
    router.push({ name: '/APIBilling' });
  } else if (type === 3) {
    router.push({ name: '/UsageGuide' });
  }
};

const logoutHandle = () => {
  // userStore.logout().finally(() => {
  //   router.push('/login');
  // });
  userStore.removeLoginInfo();
};
const resetPassword = () => {
  isShowEditDialog.value = true;
  editFormData.value = {};
};
const editSubmit = () => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (editFormData.value.newPassword !== editFormData.value.againPassword) {
        ElMessage.warning('两次密码不一致');
      } else if (editFormData.value.newPassword === editFormData.value.oldPassword) {
        ElMessage.warning('新旧密码相同');
      } else if (editFormData.value.newPassword.indexOf(userStore.sysUser?.name) > -1) {
        ElMessage.warning('新密码不能包含用户名');
      } else {
        ElMessageBox.confirm('确认重置密码?').then(() => {
          editHandleSync().then(() => {
            isShowEditDialog.value = false;
            userStore.logout().finally(() => {
              router.push('/login');
            });
          });
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.top-bar {
  width: 100%;
  height: var(--layout-topbar-height);
  display: flex;
  box-shadow: 0px 0px 10px rgb(0, 0, 170, 0.15);
  transform: translate3d(0, 0, 0);
  justify-content: space-between;
  align-items: center;
  // background-color: var(--layout-topbar-color);
  // background-image: var(--layout-topbar-bg);
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // border-radius: 0 50px 50px 0;
  line-height: var(--layout-topbar-height);
  font-size: 24px;
  .top-bar-title {
    display: flex;
    height: 100%;
    margin-right: 20px;
    align-items: center;
    .expand-icon {
      margin: 0 15px;
      color: #fff;
      font-size: 35px;
    }
    .logo-icon {
      height: 60px;
      margin: 0 20px;
    }
    .logo-title {
      color: #fff;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .top-bar-menu {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    position: relative;
  }
  .top-bar-user {
    width: 240px;
    display: flex;
    height: 100%;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    .top-bar-user-no {
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .top-bar-user-no-img {
        color: #aaaaaa;
      }
      .top-bar-user-no-text {
        color: #aaaaaa;
        font-size: 14px;
      }
    }

    .user-dark {
      margin-right: 20px;
      --el-switch-border-color: #dcdfe6;
      --el-switch-on-color: #2c2c2c;
    }

    .user-message {
      height: 30px;
      display: flex;
      align-items: center;
      color: #fff;
      margin-right: 20px;
      font-size: 16px;
      .el-icon {
        margin-right: 5px;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      border-radius: 10px;
      outline: none;
      color: #000;
      margin-right: 20px;
      z-index: 9999;
      .user-avatar {
        height: 30px;
        width: 30px;
        margin: 0 5px;
      }
      .user-name {
        text-align: center;
        font-size: 16px;
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #000;
      }
      .user-img {
        width: 100%;
      }
    }
    .user-dropdown-info {
      border-bottom: 2px solid rgba(215, 215, 215, 1);
      padding: 5px 0 5px 15px;
      // padding-bottom: 5px;
      display: flex;
      justify-self: center;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
.pwd-strong {
  display: flex;
  margin-top: 20px;
  margin-bottom: 10px;
  list-style-type: none;

  li {
    margin-right: 15px;
    width: 80px;
    text-align: center;
    padding-top: 2px;
    border-top: 4px solid #ccc;
    font-size: 13px;
    color: #ccc;

    &.weak {
      border-top: 4px solid #f56c6c;
    }

    &.better {
      border-top: 4px solid #e6a23c;
    }

    &.strong {
      border-top: 4px solid #67c23a;
    }
  }
}
</style>
