<template>
  <!-- <ACard> </ACard> -->
  <div class="home" v-if="isShow1 == 1" v-loading.fullscreen.lock="SSOLoginFlag">
    <div class="header-paopao"></div>
    <img class="home-bg" src="@/assets/image/home/homeBackgroundImage.png" alt="" />
    <div class="home-back">
      <div class="wellcome"></div>

      <div class="diverge-out-box left-diverge-box">
        <div class="diverge-box diverge-bg-left" @click="changeChatBtnIsShow()">
          <div class="diverge-inside-box diverge-bg-left"></div>
          <div class="diverge-inside-box diverge-bg-left animation-delay"></div>
          <!-- <Transition name="scale">
            <Lottie v-show="!isShowChatBtn && currentHand == hand.left" :animationOptions="leftHandAnimation" :styles="leftHandStyles"></Lottie>
          </Transition> -->
          <!-- <div
            ref="leftNodeRef"
            style="cursor: pointer; position: absolute; width: 30px; height: 30px; left: -5px; z-index: 999; top: -5px; border-radius: 15px"
          ></div> -->
        </div>
        <!-- <Transition name="spread"> -->

        <!-- </Transition> -->
      </div>
      <div ref="leftBtnRef" class="home-button-1" @click="jumpTo('/MultiModelTesting')">多模型会话</div>
      <!-- <Transition name="spread"> -->
      <div ref="rightBtnRef" class="home-button-2" @click="jumpTo('/LargeModelsList')">大模型列表</div>
      <!-- </Transition> -->
      <div class="diverge-out-box right-diverge-box">
        <div class="diverge-box diverge-bg-right" @click="changeModelListBtnIsShow()">
          <div class="diverge-inside-box diverge-bg-right"></div>
          <div class="diverge-inside-box animation-delay diverge-bg-right"></div>
          <!-- <Transition name="scale">
            <Lottie
              v-show="!isShowModelListBtn && currentHand == hand.right"
              :animationOptions="rightHandAnimation"
              :styles="rightHandStyles"
            ></Lottie>
          </Transition> -->
          <!-- <div
            ref="rightNodeRef"
            style="cursor: pointer; position: absolute; width: 30px; height: 30px; left: -5px; z-index: 999; top: -5px; border-radius: 15px"
          ></div> -->
        </div>
      </div>
      <div class="vedio" v-if="!isPlayVideo">
        <div class="click-play" @click="changePlayVideo(true)"></div>
        <!-- <Lottie :animationOptions="videoAnimation" :styles="videoStyles" @click="changePlayVideo(true)"></Lottie> -->
      </div>
      <div v-else class="vedio boxshadow">
        <video
          ref="videoRef"
          style="width: 100%; object-fit: fill; border-radius: 5px; height: 100%"
          controls
          type="video/mp4"
          src="@/assets/video/Made with FlexClip.mp4"
        ></video>
        <div
          style="
            position: absolute;
            width: 100%;
            top: 0px;
            text-align: end;
            padding-right: 15px;
            z-index: 9999;
            color: #ccc;
            border-radius: 5px 5px 0px 0px;
            font-size: 25px;
            height: 35px;
            opacity: 0.8;
          "
        >
          <span style="cursor: pointer" @click="changePlayVideo(false)">×</span>
        </div>
      </div>
      <!-- <div class="button">
        <div class="card middle">
          <div class="front">
            <div class="but" @click="jumpTo('/MultiModelTesting')">多模型会话</div>
          </div>
          <div class="back">
            <div class="back-content middle">
              <div class="but-hover" @click="jumpTo('/MultiModelTesting')">立即体验</div>
            </div>
          </div>
        </div>
        <div class="card middle">
          <div class="front">
            <div class="but" @click="jumpTo('/LargeModelsList')">大模型列表</div>
          </div>
          <div class="back">
            <div class="back-content middle">
              <div class="but-hover" @click="jumpTo('/LargeModelsList')">立即体验</div>
            </div>
          </div>
        </div>
      </div> -->
      <div style="flex: 1.5; width: 45vw; padding-right: 25px; font-size: 14px; text-align: center; align-content: end; padding-bottom: 5px">
        Copyright2024 © 软通智算科技(广东)集团有限公司 版权所有
      </div>
    </div>
  </div>
  <div v-else-if="isShow1 == 0" class="home1"></div>

  <div v-else class="login-card">
    <div class="login-card-small">
      <div class="login-label">欢迎登录</div>
      <el-form ref="ruleFormRef" label-width="0" :model="loginParams" :rules="loginRules" @keyup.enter="onSubmit">
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
        </el-form-item>
        <!-- <el-form-item class="remember-item">
            <div><el-checkbox v-model="rememberMe" label="记住密码" size="large" /></div>
          </el-form-item> -->
        <el-form-item class="check-item">
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
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '/Home',
});
import '@/styles/iconfont/iconfont.css';
import { computed, onUnmounted, Ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import Lottie from '@/components/Lottie/Lottie.vue';
const userStore = useUserStore();
const isShow1 = computed(() => userStore.sysStatus);
const isPlayVideo = ref(false);
import { ref, reactive, h, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { User, Unlock, Iphone } from '@element-plus/icons-vue';
import { useLocalStorage } from '@/utils/storage';
import { loginCode, getPublicKey } from '@/api/setting/user';
import { useEdit } from './hook/useEdit';
const isShowCheckText = ref(false);
const checkWarn = ref(false);
const isShaking = ref(false);
const alertText = ref('请输入正确的邮箱地址或手机号码');
const router = useRouter();
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
const videoRef = ref();
const changePlayVideo = (boo: boolean) => {
  if (boo) {
    isPlayVideo.value = boo;
    setTimeout(() => {
      videoRef.value.play();
    }, 50);
  } else {
    isPlayVideo.value = boo;
    videoRef.value.pause();
  }
};
const jumpTo = (str: string) => {
  router.push({ name: str });
};
const SSOLoginFlag = ref(false);
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
  return;
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

const queryURLParams = function queryURLParams(URL = window.location.href) {
  const url = URL.split('?')[1];
  if (url == undefined && !store.sysUser) {
    router.push('/login');
  }
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  history.replaceState(null, '', URL.split('?')[0]);
  return params;
};
const store = useUserStore();
const SSOLogin = async () => {
  const { state, code } = queryURLParams();
  // 获取当前URL
  // const url = new URL(window.location.href);
  // // 创建URLSearchParams对象
  // const params = new URLSearchParams(url.search);
  // // 修改指定参数的值
  // params.set('paramName', 'paramValue');
  // // 将修改后的参数设置回URL
  // url.search = params.toString();
  // // 使用history.replaceState()方法修改URL，而不刷新页面
  // history.replaceState(null, '', url.href);
  if (!store.sysUser) {
    if (state && code) {
      SSOLoginFlag.value = true;

      await store.sysUserInit(state, code).then(
        (data) => {
          // 执行成功回调
          SSOLoginFlag.value = false;
        },
        (reason) => {
          // 执行失败回调
          if (reason === 'no-groups') {
            ElMessage({
              showClose: true,
              message: '没有检测到有效的groups,请尝试换个账号重新登录!',
              type: 'error',
              duration: 0,
            });
            setTimeout(() => {
              store.removeLoginInfo();
            }, 3000);
          }
        },
      );
    }
  }
};
import animationData from '@/assets/json/homebtnani.json';

const videoAnimation = {
  animationData: animationData,
};
const videoStyles = {
  position: 'absolute',
  width: '820px',
  // top: '-76px',
  cursor: 'pointer',
  // borderRadius: '350px',
  // height: '100%',
};
import leftHand from '@/assets/json/handleft.json';

const leftHandAnimation = {
  animationData: leftHand,
};
const leftHandStyles = {
  position: 'absolute',
  width: '150px',
  top: '-64px',
  left: '-63.5px',
  cursor: 'pointer',
};
import rightHand from '@/assets/json/handright.json';

const rightHandAnimation = {
  animationData: rightHand,
};
const rightHandStyles = {
  position: 'absolute',
  width: '360px',
  top: '-117px',
  left: '-165px',
  cursor: 'pointer',
};
const enum hand {
  left = 'left',
  right = 'right',
  none = 'none',
}
const currentHand = ref(hand.left);
// const setHandInterval = setInterval(() => {
//   if (currentHand.value === hand.left) {
//     currentHand.value = hand.none;
//     setTimeout(() => {
//       currentHand.value = hand.right;
//     }, 1000);
//   } else {
//     currentHand.value = hand.none;
//     setTimeout(() => {
//       currentHand.value = hand.left;
//     }, 1000);
//   }
// }, 7000);
const isShowChatBtn = ref<boolean>(false);
const isShowModelListBtn = ref<boolean>(false);
const changeChatBtnIsShow = () => {
  isShowChatBtn.value = !isShowChatBtn.value;
};
const changeModelListBtnIsShow = () => {
  isShowModelListBtn.value = !isShowModelListBtn.value;
};
const leftNodeRef = ref<HTMLElement>();
const leftBtnRef = ref<HTMLElement>();
const rightBtnRef = ref<HTMLElement>();
const rightNodeRef = ref<HTMLElement>();
const addHoverEventListener = (nodeRef: Ref<HTMLElement | undefined>, timer: any, isShowBtn: Ref<boolean>) => {
  const fn = () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    isShowBtn.value = true;
  };
  nodeRef.value?.addEventListener('mouseover', () => {
    fn();
  });
  return fn;
};
const addMouseOutEventListener = (nodeRef: Ref<HTMLElement | undefined>, timer: any, isShowBtn: Ref<boolean>) => {
  const fn = () => {
    timer.value = setTimeout(() => {
      isShowBtn.value = false;
    }, 500);
  };
  nodeRef.value?.addEventListener('mouseout', () => {
    fn();
  });
  return fn;
};
const eventList: any = [];

const addEventListener = (nodeRef: Ref<HTMLElement | undefined>, BtnRef: Ref<HTMLElement | undefined>, isShowBtn: Ref<boolean>) => {
  const timeout = ref();
  const fn1 = addHoverEventListener(nodeRef, timeout, isShowBtn);
  eventList.push({
    who: nodeRef,
    event: 'mouseover',
    fn: fn1,
  });
  const fn2 = addMouseOutEventListener(nodeRef, timeout, isShowBtn);
  eventList.push({
    who: nodeRef,
    event: 'mouseout',
    fn: fn2,
  });
  const fn3 = addHoverEventListener(BtnRef, timeout, isShowBtn);
  eventList.push({
    who: BtnRef,
    event: 'mouseover',
    fn: fn3,
  });
  const fn4 = addMouseOutEventListener(BtnRef, timeout, isShowBtn);
  eventList.push({
    who: BtnRef,
    event: 'mouseout',
    fn: fn4,
  });
};

const hoverEventListenerFn = () => {
  addEventListener(leftNodeRef, leftBtnRef, isShowChatBtn);
  addEventListener(rightNodeRef, rightBtnRef, isShowModelListBtn);
};
onMounted(() => {
  SSOLogin();
  // hoverEventListenerFn();
});
// onUnmounted(() => {
//   eventList.forEach((item: any) => {
//     item.who.value?.removeEventListener(item.event, item.fn);
//   });
// });
onBeforeUnmount(() => {
  clearInterval(timer.value);
  // clearInterval(setHandInterval);
});
</script>

<style lang="scss" scoped>
.home {
  // background: #f5f6f7;
  //background: url('@/assets/image/home/homeBg.png') no-repeat;
  // background-size: cover;
  // background-size: 310px 300px;
  // position: relative;
  .home-bg {
    width: 100%;
    height: 100%;
    object-fit: fill; /* 图片会覆盖整个容器 */
    object-position: top; /* 控制裁剪的部分 */
  }
  height: calc(100% + 10px);
  margin: -10px;
  margin-top: 0px;
  display: flex;
  overflow-x: hidden;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  .header-paopao {
    width: 50%;
    height: 300px;
    position: absolute;
    background: url('@/assets/image/home/homepaopao.png') no-repeat;
    background-position-x: -370px;
    z-index: 9;
    background-position-y: 20px;
  }
  .home-back {
    position: absolute;
    // background: url('@/assets/image/home/0.png') no-repeat 160px 30px;
    background-size: 310px 300px;
    width: 1500px;
    // height: 100%;
    height: calc(100% - 100px);
    padding-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .wellcome {
    height: 230px;
    background: url('@/assets/image/home/homeTitle.png') no-repeat;
    background-position-y: 60px;
    background-position-x: center;
    width: 80%;
    z-index: 99;
  }
  .vedio {
    width: 60%;
    // max-width: 1000px;
    flex: 9;
    background-position-y: calc(100% - 125px);
    //overflow: hidden;
    border-radius: 5px;
    // background-size: 100% 280px;
    // border: 1px solid transparent;
    // background-clip: padding-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    position: relative;
    // margin-top: 100px;
    .title {
      height: 80%;
      padding-top: 7%;
      align-content: center;
    }
    span {
      height: 15%;
      display: block;
      padding-left: calc(100% - 100px);
      cursor: pointer;
    }
    .click-play {
      cursor: pointer;
      width: 120px;
      height: 120px;
      position: absolute;
      right: 16%;
      bottom: -11%;
    }
  }
  .boxshadow {
    border: 1px solid black;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.15);
  }
  .button {
    flex: 2;
    width: 400px;
    height: 100px;
    // margin-top: 80px;
    font-size: 14px;
    font-weight: 700;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card {
      cursor: pointer;
      width: 160px;
      height: 80px;
      position: relative;

      .front,
      .back {
        width: 100%;
        height: 100%;
        position: absolute;
        transition: transform 0.22s linear;
        backface-visibility: hidden;
      }

      .front {
        z-index: 1;
        transform: perspective(600px) rotateX(0deg);
        &.but {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .back {
        transform: perspective(600px) rotateX(-180deg);
        .back-content {
          text-align: center;
          width: 100%;
        }
      }
    }

    .but {
      cursor: pointer;
      width: 160px;
      height: 60px;
      border: 1px solid #f6bab0;
      border-radius: 10px;
      background-color: #f3eef1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }

    .but-hover {
      cursor: pointer;
      width: 160px;
      height: 80px;
      border-radius: 10px;
      background: linear-gradient(to bottom, rgba(251, 238, 232, 1) 0%, rgba(251, 238, 232, 0.1) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card:hover > .front {
      transform: perspective(600px) rotateX(-180deg);
    }

    .card:hover > .back {
      transform: perspective(600px) rotateX(0deg);
    }
  }
}
.home1 {
  background: url('@/assets/image/home/u126.svg') no-repeat center center;
  background-size: 600px 600px;
  height: 100%;
}

.login-card {
  position: absolute;
  top: 45%;
  left: 58%;
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
        box-shadow: 0 0 0 1px #7763f1;
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

.home-button-1 {
  cursor: pointer;
  position: absolute;
  width: 350px;
  height: 190px;
  left: -10%;
  bottom: 50%;
  font-size: 36px;
  text-align: center;
  align-content: center;
  z-index: 88;
  padding-left: 60px;
  padding-bottom: 30px;
  overflow: hidden;
  white-space: nowrap;
  background: url('@/assets/image/home/leftbutton.png') no-repeat;
  background-size: 100% 100%;
}
.home-button-2 {
  cursor: pointer;
  width: 350px;
  height: 190px;
  left: -10%;
  bottom: 20%;
  font-size: 36px;
  text-align: center;
  align-content: center;
  z-index: 88;
  overflow: hidden;
  white-space: nowrap;
  padding-left: 60px;
  padding-bottom: 30px;
  position: absolute;
  background: url('@/assets/image/home/rightbutton.png') no-repeat;
  background-size: 100% 100%;
}
.diverge-out-box {
  position: absolute;
  .diverge-box {
    // cursor: pointer;
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 15px;
  }
  .diverge-inside-box {
    width: 22px;
    height: 22px;
    position: absolute;
    border-radius: 15px;
    animation: diverge 2.6s infinite;
  }
  .animation-delay {
    animation-delay: 1.3s;
  }
}
.left-diverge-box {
  left: 20.4%;
  top: 52%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.right-diverge-box {
  right: 18.3%;
  top: 59%;
}
@keyframes diverge {
  from {
    opacity: 1;
    scale: 1;
  }
  to {
    opacity: 0;
    scale: 3.5;
  }
}
.spread-enter-active,
.spread-leave-active {
  transition: all 0.6s ease;
}
.spread-enter-from,
.spread-leave-to {
  opacity: 0;
  width: 0;
}
.diverge-bg-left {
  background: #fff;
}
.diverge-bg-right {
  background: #fff;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 1s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  scale: 1.5;
}
</style>
