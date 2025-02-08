<template>
  <!-- <div class="login"> -->
  <!-- <div class="login-title"><span>ARK </span> 丨 <span> 虚拟电厂运营管理云平台</span></div> -->
  <!-- <div class="login-card">
      <div class="login-card-small">
        <div class="login-label">欢迎登录</div>
        <el-form v-if="authStatus === 1" ref="ruleFormRef" label-width="0" :model="loginParams" :rules="loginRules" @keyup.enter="onSubmit">
          <el-form-item class="user-item" style="margin-bottom: 40px" name="username" prop="username">
            <el-input
              size="large"
              clearable
              placeholder="请输入邮箱地址或电话号码"
              v-model="loginParams.username"
              :prefix-icon="() => h(ElIcon, { color: '#fff', size: 25 }, { default: () => h(AIcon, { icon: 'icon-dengluzhanghao' }) })"
            />
          </el-form-item>
          <el-form-item class="user-item" style="margin-bottom: 30px" prop="password">
            <el-input
              size="large"
              type="password"
              placeholder="请输入登录密码"
              show-password
              :prefix-icon="() => h(ElIcon, { color: '#CCCCCC', size: 25 }, { default: () => h(AIcon, { icon: 'icon-denglumima' }) })"
              v-model="loginParams.password"
            />
          </el-form-item> -->
  <!-- <el-form-item class="remember-item">
            <div><el-checkbox v-model="rememberMe" label="记住密码" size="large" /></div>
          </el-form-item> -->
  <!-- <el-form-item class="check-item">
            <div v-show="isShowCheckText" class="check-item-text">
              <div :class="{ 'check-item-text-warn': checkWarn }">{{ alertText }}</div>
            </div>
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button :class="{ shake: isShaking }" size="large" class="login-submit-button" type="primary" @click="onSubmit()">{{
              '登录'
            }}</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="authStatus === 2" ref="phoneFormRef" label-width="0" :model="phoneParams" :rules="phoneRules" @keyup.enter="onSubmit">
          <el-form-item class="user-item" style="margin-bottom: 40px" name="phone" prop="phone">
            <el-input
              size="large"
              placeholder="手 机 号"
              v-model="phoneParams.phone"
              :disabled="true"
              :prefix-icon="() => h(ElIcon, { color: '#fff', size: 18 }, () => h(Iphone))"
            />
          </el-form-item>
          <el-form-item class="captcha-item" prop="captcha">
            <div class="captcha-box">
              <el-input class="login-captcha-input" v-model="phoneParams.captcha" type="captcha" placeholder="请输入验证码"> </el-input>
              <div class="login-captcha-img"><img @click="changeCaptcha" :src="captcha" alt="验证码" /></div> -->
  <!-- <el-button class="login-reset-button" size="large" @click="resetForm()">重置</el-button> -->
  <!-- <el-button v-if="captchaFlag" class="login-phone-button" @click="getCaptcha()">发送验证码</el-button> -->
  <!-- <el-button v-else class="login-reset-button" size="large">{{ seconds }}</el-button>
            </div>
          </el-form-item>
          <el-form-item class="submit-item">
            <el-button size="large" class="login-submit-button" type="primary" @click="onSubmit()">{{ '登 &nbsp;&nbsp;&nbsp; 录' }}</el-button>
          </el-form-item>
        </el-form>
      </div>  -->

  <!-- <div class="border_corner border_corner_left_top"></div>
      <div class="border_corner border_corner_right_top"></div>
      <div class="border_corner border_corner_left_bottom"></div>
      <div class="border_corner border_corner_right_bottom"></div> -->
  <!-- </div>
  </div> -->
  <!-- <ADialog :title="'重置密码'" v-model:isShow="isShowEditDialog" @submit="editSubmit()">
    <AForm ref="editFormRef" v-loading="editFormLoading" :list="editFormList" :data="editFormData" :column="1" :rules="editFormRules">
      <template #pwdLevel>
        <ul class="pwd-strong">
          <li :class="{ weak: pwdLevel === 0 }">弱</li>
          <li :class="{ better: pwdLevel === 1 }">中</li>
          <li :class="{ strong: pwdLevel === 2 }">强</li>
        </ul>
      </template>
    </AForm>
  </ADialog> -->
  <div></div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { User, Unlock, Iphone } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { useLocalStorage } from '@/utils/storage';
import { loginCode, getPublicKey } from '@/api/setting/user';
import { useEdit } from './hook/useEdit';
import AIcon from '@/components/AAUI/AIcon/AIcon.vue';
import { useCasdoor } from 'casdoor-vue-sdk';

const isShowCheckText = ref(false);
const checkWarn = ref(false);
const isShaking = ref(false);
const alertText = ref('请输入正确的邮箱地址或手机号码');
const router = useRouter();
const userStore = useUserStore();
const storage = useLocalStorage();
const { pwdLevel, editFormRef, editFormList, editFormData, editHandleSync, editFormLoading, editFormRules, isShowEditDialog } = useEdit();
const loginParams = reactive({
  username: storage.get('username') || '',
  password: storage.get('password') || '',
  loginType: 1,
  // captchaId: '',
  // captcha: ''
});
const phoneParams = reactive({
  phone: '',
  captcha: '',
});
const phone = ref('');
const timer = ref();
const seconds = ref(60);
const captchaFlag = ref(true);
const authStatus = ref<number>(1);
const ruleFormRef = ref<FormInstance>();
const phoneFormRef = ref<FormInstance>();
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { required: true, message: '密码长度在6-15之间', trigger: 'blur' },
  ],
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
const phoneRules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

// const resetForm = () => {
//   ruleFormRef.value?.resetFields();
//   loginParams.username = '';
//   loginParams.password = '';
// };

const getCaptcha = () => {
  if (!phoneParams.phone) {
    ElMessage.warning('联系管理员添加手机号');
    return;
  }
  if (phoneParams.phone.length !== 11) {
    ElMessage.warning('手机号错误请联系管理员');
    return;
  }
  loginCode({ phone: phone.value }).then((res) => {
    if (res.success) {
      ElMessage.success('验证码发送成功！');
      captchaFlag.value = false;
      timer.value = setInterval(() => {
        if (seconds.value <= 1) {
          captchaFlag.value = true;
          seconds.value = 60;
          clearInterval(timer.value);
        } else {
          seconds.value--;
        }
      }, 1000);
    } else {
      ElMessage.error(res.msg || '验证码发送失败！');
    }
  });
};

const onSubmit = async () => {
  // if (!storage.get('RSAToken')) {
  //   const res = await getPublicKey();
  //   if (res.success && res.data) {
  //     storage.set('RSAToken', res.data);
  //   } else {
  //     ElMessage.error(res.msg || '获取公钥失败');
  //     return;
  //   }
  // }
  if (loginParams.username == '') {
    isShowCheckText.value = true;
    alertText.value = '请输入正确的邮箱地址或手机号码';

    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }
  if (loginParams.password == '') {
    isShowCheckText.value = true;
    alertText.value = '请填写登录密码';

    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }
  if (authStatus.value === 1) {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        loginHandle();
      }
    });
  } else {
    phoneFormRef.value?.validate((valid) => {
      if (valid) {
        loginHandle();
      }
    });
  }
};

const loginHandle = () => {
  // rememberPassword();
  // const param = <any>{};
  // const userInfo = <any>{};
  // const publicKey = storage.get('RSAToken');
  // const key = new JSEncrypt();
  // key.setPublicKey(publicKey);
  // if (authStatus.value === 1) {
  //   userInfo.username = loginParams.username;
  //   userInfo.password = loginParams.password;
  //   param.loginType = 1;
  //   param.userInfo = key.encrypt(JSON.stringify(userInfo));
  // } else {
  //   userInfo.username = phone.value;
  //   userInfo.password = phoneParams.captcha;
  //   param.loginType = 3;
  //   param.userInfo = key.encrypt(JSON.stringify(userInfo));
  // }
  // userStore.login(param).then((res: any) => {
  //   if (res.code === 20009 || res.code === 20010) {
  //     resetPassword();
  //   } else if (res.authStatus === 1) {
  //     router.push('/');
  //   } else if (res.authStatus === 2) {
  //     phone.value = res.phone;
  //     phoneParams.phone = res.phone.substr(0, 3) + '****' + res.phone.substr(7);
  //     // 手机验证码登录
  //     authStatus.value = 2;
  //   }
  // });
};

const rememberMe = ref<boolean>(storage.get('rememberMe') || false);
const rememberPassword = () => {
  storage.set('rememberMe', rememberMe.value);
  if (rememberMe.value) {
    storage.set('username', loginParams.username);
    storage.set('password', loginParams.password);
  } else {
    storage.remove('username');
    storage.remove('password');
  }
};

const editSubmit = () => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (editFormData.value.newPassword !== editFormData.value.againPassword) {
        ElMessage.warning('两次密码不一致');
      } else if (editFormData.value.newPassword === editFormData.value.oldPassword) {
        ElMessage.warning('新旧密码相同');
      } else if (editFormData.value.newPassword.indexOf(loginParams.username) > -1) {
        ElMessage.warning('新密码不能包含用户名');
      } else {
        ElMessageBox.confirm('确认重置密码?').then(() => {
          editHandleSync().then(() => {
            isShowEditDialog.value = false;
            router.push('/login');
          });
        });
      }
    }
  });
};

const resetPassword = () => {
  isShowEditDialog.value = true;
  editFormData.value = {
    loginName: loginParams.username,
  };
};

const { getSigninUrl, getSignupUrl } = useCasdoor();
onMounted(() => {
  window.location.href = getSigninUrl();
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #0b254a;
  background-image: url('@/assets/login-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  // .login-title {
  //   color: #fff;
  //   font-size: 30px;
  //   padding: 40px 50px;
  //   :first-child {
  //     font-weight: bold;
  //   }
  // }
  .login-card {
    position: absolute;
    top: 55%;
    left: 35%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 600px;
    padding: 20px 25px;
    display: flex;
    flex-direction: column;
    background-color: rgba(251, 230, 232, 0.5);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    // border: solid 1px #3081c580;
    .login-card-small {
      width: 600px;
      height: 500px;
      // padding: 50px;
      border-radius: 15px;
      box-shadow: 2px 2px 2px 1px rgba(170, 170, 170, 0.35);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: center;
    }
    // text-align: center;
    .login-label {
      color: #333;
      font-size: 20px;
      // margin: 8px 0 15px 0;
      margin-bottom: 50px;
      margin-top: 50px;
      font-weight: 700;
    }
    .user-item {
      .el-input {
        width: 400px;
        height: 50px;
        :deep(input) {
          margin-left: 10px;
          // color: #fff;
        }
        :deep(.el-input__wrapper:hover) {
          box-shadow: 0 0 0 1px #d70010;
        }

        // :deep(input::placeholder) {
        //   color: #fff;
        // }
        // :deep(.el-input__wrapper) {
        //   background-color: #01132f;
        //   box-shadow: 0 0 0 1px #3081c580 inset;
        //   font-size: 14px;
        // }
      }
    }
    .captcha-item {
      margin-bottom: 40px;
      .captcha-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .login-captcha-input {
          width: 120px;
          height: 30px;
          :deep(input) {
            color: #fff;
          }
          :deep(input::placeholder) {
            color: rgba(255, 255, 255, 0.5);
          }
          :deep(.el-input__wrapper) {
            background-color: #01132f;
            box-shadow: 0 0 0 1px #3081c580 inset;
            font-size: 13px;
          }
          :deep(.el-input__wrapper) {
            box-shadow: 0 0 0 1px #3081c580 inset;
          }
        }
        .login-captcha-img {
          width: 60px;
          height: 30px;
          overflow: hidden;
          border-radius: 3px;
          img {
            width: 100%;
            height: 100%;
            background-color: #f5f7fa;
          }
        }
        .login-reset-button {
          width: 53px;
          height: 30px;
          background-color: transparent;
          color: rgba(255, 255, 255, 0.5);
          border: solid 1px #3081c580;
          font-size: 13px;
        }
      }
    }
    .login-phone-button {
      background-color: transparent;
      border: 0;
      color: #fff;
    }
    .check-item {
      width: 400px;
      height: 40px;
      .check-item-text {
        background-color: #fff5e6;
        border: 1px solid #ffebcc;
        color: #ff9900;
        padding-left: 20px;
        border-radius: 5px;
        width: 100%;
        .check-item-text-warn {
          color: #f56c6c;
        }
      }
    }
    // .remember-item {
    //   margin-bottom: 0px;
    //   :deep(.el-checkbox__inner) {
    //     border: solid 1px #3081c580;
    //   }
    // }
    .submit-item {
      width: 100%;
      margin-top: 30px;
      .login-submit-button {
        width: 400px;
        height: 50px;
        color: #fff;
        background-color: #7763f1;
        font-size: 18px;
        font-weight: 700;
        border-radius: 15px;
        border: none;

        &:hover {
          background-color: rgb(215, 0, 15, 0.5);
        }
      }
    }
  }
}
.shake {
  animation: jump 0.5s linear infinite;
}
@keyframes jump {
  0% {
    transform: translate(0px, 1px);
  }
  10% {
    transform: translate(0, -2px);
  }
  20% {
    transform: translate(0, 2px);
  }
  30% {
    transform: translate(0, -4px);
  }
  40% {
    transform: translate(0, 4px);
  }
  50% {
    transform: translate(0, -4px);
  }
  60% {
    transform: translate(0, 4px);
  }
  70% {
    transform: translate(0, -2px);
  }
  80% {
    transform: translate(0, 2px);
  }
  90% {
    transform: translate(0, -1px);
  }
  100% {
    transform: translate(0, 0);
  }
}
.login-card {
  position: relative;
  // .border_corner {
  //   z-index: 10;
  //   position: absolute;
  //   width: 30px;
  //   height: 30px;
  //   background: rgba(0, 0, 0, 0);
  //   border: 3px solid #04b3e5;
  // }
  .border_corner_left_top {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }
  .border_corner_right_top {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
  }
  .border_corner_left_bottom {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
  }
  .border_corner_right_bottom {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }
}
// .pwd-strong {
//   display: flex;
//   margin-top: 20px;
//   margin-bottom: 10px;
//   list-style-type: none;

//   li {
//     margin-right: 15px;
//     width: 80px;
//     text-align: center;
//     padding-top: 2px;
//     border-top: 4px solid #ccc;
//     font-size: 13px;
//     color: #ccc;

//     &.weak {
//       border-top: 4px solid #f56c6c;
//     }

//     &.better {
//       border-top: 4px solid #e6a23c;
//     }

//     &.strong {
//       border-top: 4px solid #67c23a;
//     }
//   }
// }
</style>
