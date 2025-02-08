<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { onBeforeMount, computed, onBeforeUnmount, onMounted, ref, watch, watchEffect, nextTick, Ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
// import {
//     getWebsocketUrl
// } from "@/ts/AiChatWebSocket.ts";
// import { sparkConfig } from '@/config/config.ts';
import { ElMessage, valueEquals, dayjs, ClickOutside as vClickOutside } from 'element-plus';
import { ChatItem, WSReqParams, WSResParams, wsSendMsgFormat } from './hook/AiChatWebSocket';
import { Loading, Delete, DocumentCopy } from '@element-plus/icons-vue';
import { copyToClipboard } from '@/utils/commonUtil';
import ACard from '@/components/AAUI/ACard/ACard.vue';
import { useUserStore } from '@/store/modules/user';
import { useChat } from './hook/chat';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@/utils/storage';
import { Plus } from '@element-plus/icons-vue';
import { userGuide1 } from '@/api/UsageGuide/guide';

// import MarkdownIt from 'markdown-it';

import { md } from './hook/md';

import Clipboard from 'clipboard';

const renderedMarkdown = (text: any) => {
  // const md = new MarkdownIt({
  //   html: true, // 在源码中启用 HTML 标签
  //   linkify: true, // 自动识别链接
  //   typographer: false, // 启用一些语言学的替换和格式
  // });

  // console.log(text);
  return md.render(text);
  // return text;
};

const storage = useLocalStorage();
const router = useRouter();
const {
  maxCharCount,
  switchValue,
  apiKey,
  useApiData,
  problemText,
  sendBtnDisabled,
  getChat,
  getModelList,
  newModelOptions,
  getHisTextList,
  getIsNewConversation,
  setConversationTitle,
  chatList,
  iconList,
  // addNewModel,
  removeModel,
  isNewChat,
  // newModelValue,
  // getModelDef,
  promptList,
  apiKeyList,
  getApiKeylList,
  getMaxTokenInit,
} = useChat();
const props = defineProps(['chatNew']);
//隐私政策和用户协议
const ysUrl = ref('');
const userUrl = ref('');
//历史聊天显示
const isShowHisBtn = ref(true);
const showHis = () => {
  isShowHisBtn.value = false;
  chatList.value.map((item) => {
    item.isNotShowHis = false;
  });
  nextTick(() => {
    const scrollElem = aiChatListRef.value;
    scrollElem.scrollTo({ top: scrollElem.scrollHeight });
  });
};
const chatNew = computed(() => {
  return props.chatNew;
});
//创建提示词发送
const promptCreate = () => {
  // if (iconList.value.length == 0) {
  //   ElMessage.warning({ message: '请添加模型' });
  //   return;
  // }
  //列表要添加，模型参数要封装
  // iconList.value.map((model: any) => {
  promptList.value = [];
  const promptStorage = storage.get(chatNew.value.conversationId);
  if (promptStorage) {
    promptList.value = promptStorage;
  }

  // const formData = {
  //   sessionId: chatNew.value.sessionId,
  //   model: model.name,
  //   messages: <any>[],
  //   max_tokens: 300,
  //   stream: true,
  // };
  // arrData.forEach((item: any) => {
  //   chatList.value.push({
  //     role: item.role,
  //     modelName: model.name,
  //     content: item.promptContext,
  //   });
  //   formData.messages.push({
  //     role: item.role,
  //     content: [
  //       {
  //         type: 'text',
  //         text: item.promptContext,
  //       },
  //     ],
  //   });
  // });
  // chatList.value.push({
  //   v_id: chatList.value.length - 1,
  //   role: 'assistant',
  //   modelName: model.name,
  //   content: '',
  //   loading: true,
  // });
  //发送聊天请求
  // getChat(formData, chatList.value.length - 1);
  // });
};
watchEffect(async () => {
  if (chatNew.value.conversationId != '') {
    isShowHisBtn.value = true;
    chatList.value = [];
    sendBtnDisabled.value = false;
    promptCreate();
    isNewChat.value = true;
    getHisTextList({ conversationId: chatNew.value.conversationId }).then(() => {
      // if (chatList.value.length > 0) {
      //   isNewChat.value = false;
      // }
    });
    const res = await getIsNewConversation({ conversationId: chatNew.value.conversationId });
    if (!res.data) {
      isNewChat.value = false;
    }
    $emit('changeLoadingChat', false);

    //新年图片
    changeYear.value++;
  }
});
const $emit = defineEmits(['handleShowPrompt', 'changeLoadingChat', 'addChatListFun', 'handleShowModelSelect']);
const handleShowPrompt = () => {
  $emit('handleShowPrompt', true);
};

//点击修改弹框值
const modelSelectF = (flag: boolean) => {
  $emit('handleShowModelSelect', flag);
};
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const userName = userStore.sysUser?.name || '';
const userStoreInfo = ref({
  img: userStore.sysUser?.avatar || new URL(`@/assets/image/home/icon-morentouxiang.svg`, import.meta.url).href,
  name: userStore.sysUser?.name,
});

//定义会话列表的观察对象（观察子元素的变化，当会话有变化时，自动滚动到变化的位置，用于提高用户体验度）
let chatListObserver: MutationObserver;
let funMutationObserver: any = null;
let scrollTimeout: number | undefined;
const SCROLL_PAUSE_TIME = 200; // 用户停止滚动后等待的时间，单位为毫秒

// 标记用户是否正在手动滚动
let isUserScrolling = false;
//聊天列表引用对象
const aiChatListRef = ref();
import type { ElInput } from 'element-plus';
// let MutationObserver: any = null;
const clipboard = ref<any>();
onMounted(() => {
  nextTick(() => {
    clipboard.value = new Clipboard('.copy-btn');
    clipboard.value.on('success', (e) => {
      ElMessage.success({ message: '复制成功' });
    });
    clipboard.value.on('error', (e) => {
      ElMessage.warning({ message: '复制失败' });
    });
  });

  userGuide1().then((res) => {
    if (res.code === 0 && res.data) {
      // docUrl.value = res.data;
      ysUrl.value = res.data.ysUrl;
      userUrl.value = res.data.userUrl;
    }
  });
  //getMaxTokenInit
  // apiKey,
  useApiData().then(() => {
    if (!apiKey.value) {
      setTimeout(() => {
        router.push({ name: '/APIManagement' });
      }, 1000);
    }
  });

  //获取apikey列表
  getApiKeylList();

  // getModelDef(userId);

  //调用监听目标元素的高度变化函数
  funMutationObserver = createMutationObserver(aiChatListRef.value);
});
/**
 * 聊天列表变化的观察对象：用于监听目标元素的高度变化
 * @param targetElement  要监听的目标元素
 */
const createMutationObserver = (targetElement: Element) => {
  const handleScroll = () => {
    isUserScrolling = true;

    if (chatListObserver) {
      chatListObserver.disconnect(); // 暂停观察
    }

    // 清除之前的定时器，以防多次滚动触发多个定时器
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // 设置一个新的定时器，当用户停止滚动一段时间后重新开始观察
    scrollTimeout = window.setTimeout(() => {
      const scrollHeight = targetElement.scrollHeight;
      const scrollTop = targetElement.scrollTop;
      const clientHeight = targetElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight <= 120) {
        isUserScrolling = false;
        if (chatListObserver) {
          chatListObserver.observe(targetElement, { childList: true, subtree: true });
        }
        scrollTimeout = undefined;
      }
    }, SCROLL_PAUSE_TIME);
  };

  // 监听用户的滚动事件
  targetElement.addEventListener('scroll', handleScroll);

  // 创建MutationObserver 实例，用于检测DOM变化
  chatListObserver = new MutationObserver((mutationsList: any, observer: any) => {
    // 当子元素发生变化时，获取元素的滚动区域高度
    const scrollHeight = targetElement.scrollHeight;
    if (mutationsList && !isUserScrolling) {
      scrollHandle(scrollHeight);
    }
  });

  // 启动监测器并配置所需的观察选项
  chatListObserver.observe(targetElement, { childList: true, subtree: true });

  // 返回一个函数，可以在不再需要监听时移除事件监听器和断开观察者
  return () => {
    targetElement.removeEventListener('scroll', handleScroll);
    if (chatListObserver) {
      chatListObserver.disconnect();
    }
  };
};
/**
 * 滚动定位处理
 * @param val
 */
const scrollHandle = (val: number) => {
  nextTick(() => {
    aiChatListRef.value?.scrollTo({
      //scrollTo:把内容滚动到指定的坐标
      top: val,
      behavior: 'smooth',
    });
  });
};
//缩小和展开函数
const scaleContext = (item: any) => {
  item.extendPro = !item.extendPro;
};
//发送问题的函数
const sendQuestion = () => {
  if (iconList.value.length == 0) {
    ElMessage.warning({ message: '请添加模型' });
    return;
  }
  if (sendBtnDisabled.value) {
    //阻止内容发送
    return;
  }
  if (problemText.value?.trim()?.length <= 0) {
    //输入问题文字是空字符串的提示
    ElMessage.warning({ message: '请输入您想要了解的内容...' });
    return;
  }

  chatList.value.push({
    role: 'user',
    content: problemText.value,
  });
  sendBtnDisabled.value = true;

  const formData = {
    sessionId: chatNew.value.sessionId,
    model: '',
    messages: [
      {
        role: 'user',
        //需要根据上下文进行修改---todo
        content: [
          {
            type: 'text',
            text: problemText.value,
          },
        ],
      },
    ],
    stream: true,
  };

  //聊天方法
  askSpark(formData);
};
//连接星火认知大模型并发送问题
const askSpark = (formData: any) => {
  //1. 生成鉴权apiKey操作

  //2.查看选中模型列表
  iconList.value.map((model: any) => {
    //maxtoken添加
    // formData.max_tokens = model.maxTokens - problemText.value.length * 2;
    //构建指定模型聊天
    formData.model = model.name;
    //构建聊天列表
    chatList.value.push({
      v_id: chatList.value.length - 1,
      role: 'assistant',
      modelName: model.name,
      content: '',
      loading: true,
      icon: model.iconUrl,
      // maxTokens: model.maxTokens,
    });
    //发送聊天请求
    getChat(formData, chatList.value.length - 1);
    formData.messages = [
      {
        role: 'user',
        //需要根据上下文进行修改---todo
        content: [
          {
            type: 'text',
            text: problemText.value,
          },
        ],
      },
    ];
  });
  //判断是否为新聊天，给左侧列表加框
  if (isNewChat.value) {
    $emit('addChatListFun', {
      conversationId: chatNew.value.conversationId,
      sessionId: chatNew.value.sessionId,
      content: problemText.value,
      createTime: dayjs().format('YYYY-MM-DD HH:mm'),
    });
    setConversationTitle({ conversationId: chatNew.value.conversationId, title: problemText.value });
    isNewChat.value = false;
  }
  //清空文本框
  problemText.value = '';
};

/**
 * 复制会话内容到剪贴板
 * @param item
 * @param index
 */
const copyRecord = (item: { content: any }, index: any) => {
  if (sendBtnDisabled.value) {
    return;
  }

  const content = item.content;
  copyToClipboard({
    content,
    success() {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    },
    error() {
      ElMessage({
        message: '复制失败',
        type: 'error',
      });
    },
  });
};
/**
 * AI 回答内容中的代码块复制
 */
const handleCopyCodeSuccess = () => {
  ElMessage({
    message: '复制成功',
    type: 'success',
  });
};
/**
 * 删除聊天记录
 * @param index
 */
const deleteRecord = (index: number) => {
  if (!sendBtnDisabled.value) {
    chatList.value.splice(index, 1);
  }
};
/**
 * 重新回答
 */
const reReply = (item: any, index: number) => {
  if (sendBtnDisabled.value) {
    return;
  }
  // if (wsMsgReceiveStatus.value !== 'receiveIng') {
  //如果是最后一条重新回答，直接删除最后一条回答记录直接作答
  // if (chatList.value.length - 1 === index) {
  //   deleteRecord(index);
  //   sendBtnDisabled.value = true;
  //   askSpark();
  // } else {
  //   //如果不是最后一条重新回答，则后面重新添加问题继续进行询问
  //   //有可能上一条回答内容被直接删除，所以需要循环往前找最近的一条问题记录进行作答
  let i = index - 1;
  while (i >= 0) {
    //角色为用户，有问题内容
    if (chatList.value[i].role === 'user' && chatList.value[i].content) {
      chatList.value.push({
        role: 'user',
        content: chatList.value[i].content,
      });
      sendBtnDisabled.value = true;
      const formData = {
        sessionId: chatNew.value.sessionId,
        model: item.modelName,
        messages: [
          {
            role: 'user',
            //需要根据上下文进行修改---todo
            content: [
              {
                type: 'text',
                text: chatList.value[i].content,
              },
            ],
          },
        ],
        stream: true,
      };
      //maxtoken
      // askSpark(formData);
      chatList.value.push({
        v_id: chatList.value.length - 1,
        role: 'assistant',
        modelName: item.modelName,
        content: '',
        loading: true,
        icon: item.icon,
        // maxTokens: item.maxTokens,
      });
      //发送聊天请求
      getChat(formData, chatList.value.length - 1);
      break;
    }
    i--;
  }
  nextTick(() => {
    const scrollElem = aiChatListRef.value;
    scrollElem.scrollTo({ top: scrollElem.scrollHeight });
  });
  // }
  // }
};

//重新提问
const replayRequestion = (item: any) => {
  if (iconList.value.length == 0) {
    ElMessage.warning({ message: '请添加模型,再重新提问' });
    return;
  }

  chatList.value.push({
    role: 'user',
    content: item.content,
  });
  sendBtnDisabled.value = true;
  const formData = {
    sessionId: chatNew.value.sessionId,
    model: '',
    // max_tokens: 0,
    messages: [
      {
        role: 'user',
        //需要根据上下文进行修改---todo
        content: [
          {
            type: 'text',
            text: item.content,
          },
        ],
      },
    ],
    stream: true,
  };
  iconList.value.map((model: any) => {
    //构建指定模型聊天
    formData.model = model.name;
    // formData.max_tokens = model.maxTokens - item.content.length * 2;
    //构建聊天列表
    chatList.value.push({
      v_id: chatList.value.length - 1,
      role: 'assistant',
      modelName: model.name,
      content: '',
      loading: true,
      icon: model.iconUrl,
      // maxTokens: model.maxTokens,
    });
    //发送聊天请求
    getChat(formData, chatList.value.length - 1);
  });

  //滚动到底部
  nextTick(() => {
    const scrollElem = aiChatListRef.value;
    scrollElem.scrollTo({ top: scrollElem.scrollHeight });
  });
};

/**
 * 监听提问问题内容的长度  不限制聊天
 */
// const problemTextWatcher = watch(
//   () => problemText.value,
//   () => {
//     //限制最大字数
//     if (problemText.value.length > maxCharCount.value) {
//       problemText.value = problemText.value.slice(0, maxCharCount.value);
//     }
//   },
// );

//新年图片
const changeYear = ref(0);

const rightToolRef = ref();
const inputRef = ref<InstanceType<typeof ElInput>>();
const chatInputAndFooterRef = ref();
const inputValueRef = ref();
const isShowLimit = ref(false);
const getWidth = () => {
  nextTick(() => {
    if (inputValueRef.value.offsetWidth + rightToolRef.value.offsetWidth >= chatInputAndFooterRef.value.offsetWidth - 20) {
      chatInputAndFooterRef.value.style.gridTemplateAreas = "'input-area input-area''left-tools right-tools'";
      isShowLimit.value = true;
    } else {
      chatInputAndFooterRef.value.style.gridTemplateAreas = "'input-area right-tools'";
      isShowLimit.value = false;
    }
  });
};
watch(
  () => problemText.value,
  () => {
    getWidth();
  },
);
/**
 * 组件销毁之前
 */
onBeforeUnmount(() => {
  //停止监听提问问题内容的长度
  // problemTextWatcher();
  //停止会话列表内容的监听
  if (funMutationObserver) funMutationObserver();

  chatListObserver.disconnect();
  //复制iconList到缓存
  userStore.modelList = iconList.value;

  clipboard.value.destroy();
});

//暴露接口
defineExpose({ promptCreate });
</script>
<template>
  <div style="height: 100%; min-height: 100%; flex: 1; display: flex; flex-direction: column">
    <ACard class="chat-header">
      <template #header>
        <div class="chat-header-box">
          <div style="display: flex; font-size: 16px; color: #333; align-items: center">
            请添加模型
            <div class="chat-header-box-icon">
              <el-button @click="modelSelectF(true)" class="chat-header-box-btn" style="margin-left: 20px; margin-right: 20px">
                <span style="font-weight: normal; color: #333; font-size: 12px">选择模型</span>&nbsp;&nbsp;&nbsp;<el-icon
                  color="#333"
                  class="el-icon--right"
                  ><ArrowDown
                /></el-icon>
              </el-button>
              <!-- <el-select v-model="newModelValue" placeholder="选择选项" size="large" style="width: 240px" @focus="modelSelectF">
                <el-option v-for="item in newModelOptions" :key="item.id" :label="item.name" :value="item.name" :disabled="item.disabled" />
              </el-select> -->
              <!-- <el-icon size="20" class="icon-color" @click="addNewModel"> <AIcon icon="icon-xinzeng" /> </el-icon> -->
              <span class="chat-header-box-icon-text">选择API-Key</span>
              <el-select v-model="apiKey" placeholder="Select">
                <el-option v-for="item in apiKeyList" :disabled="item.disabled" :key="item.apiKey" :label="item.apiKeyName" :value="item.apiKey" />
              </el-select>
            </div>
            <div></div>
          </div>

          <div class="chat-stream">
            <!-- <span style="font-weight: bold; color: #333">是否流式输出</span
            ><el-switch size="large" v-model="switchValue" inline-prompt active-text="是" inactive-text="否" /> -->
            <el-button @click="switchValue = !switchValue" class="switch-btn">
              <img src="@/assets/image/chat/switch.png" style="width: 20px" alt="" />
              &nbsp;&nbsp;
              {{ switchValue ? '流式输出' : '非流式输出' }}
            </el-button>
          </div>
        </div>
      </template>
      <div class="chat-option-box">
        <div class="chat-option-box-inner" v-for="(item, index) in iconList" :key="index">
          <img :src="item.iconUrl" alt="" />
          {{ item.name }}
          <el-icon size="20" class="icon-color" @click="removeModel(index, item)"> <AIcon icon="icon-shanchu1" /> </el-icon>
        </div>
      </div>
    </ACard>

    <div class="ai-chat-view">
      <div class="ai-chat-view-his" v-if="isShowHisBtn && chatList.length > 0">
        <div class="ai-chat-view-his-btn" @click="showHis">
          展示历史记录<el-icon :size="15" class="chatLineSquare"><Plus /></el-icon>
        </div>
      </div>
      <div class="new-year" v-if="isNewChat && changeYear <= 1">
        <img src="@/assets/image/newyear.png" alt="" />
      </div>
      <ul class="ai-chat-list" ref="aiChatListRef">
        <li class="ai-chat-item" :class="item.role + '-item'" v-for="(item, index) of promptList" :key="index">
          <!-- 头像 -->
          <div class="ai-chat-avatar" :class="item.role + '-img'">
            <img v-if="item.role === 'user'" src="@/assets/image/llm/user.png" />
            <img v-if="item.role === 'assistant'" src="@/assets/image/llm/zhushou.png" />
            <img v-if="item.role === 'system'" src="@/assets/image/llm/sys.png" />
          </div>
          <!-- 聊天内容 -->
          <div class="ai-chat-content-box" :class="item.role + '-box'" v-if="item.role === 'user'">
            <div style="display: flex; flex-direction: row-reverse; align-items: center">
              {{ item.role }}
              <div class="ai-chat-content-box-text" style="margin-right: 10px">预设提示词</div>
            </div>
            <div class="ai-chat-content-box-i">
              <div class="ai-chat-content-box-content">
                {{ item.promptContext }}
              </div>
            </div>
          </div>
          <div class="ai-chat-content-box" :class="item.role + '-box'" v-if="item.role === 'assistant'">
            <div style="display: flex; flex-direction: row; align-items: center">
              {{ item.role }}
              <div class="ai-chat-content-box-text" style="margin-left: 10px">预设提示词</div>
            </div>
            <div class="ai-chat-content-box-chat" :class="{ extendProCss: item.extendPro }">
              <!-- 支持md 预览 -->
              <div style="display: flex; flex-direction: row">
                {{ item.promptContext }}
                <!-- <v-md-preview :text="item.promptContext" @copy-code-success="handleCopyCodeSuccess"></v-md-preview> -->
              </div>
            </div>
          </div>
          <div class="ai-chat-content-box assistant-box" v-if="item.role === 'system'">
            <div style="display: flex; flex-direction: row; align-items: center">
              {{ item.role }}
              <div class="ai-chat-content-box-text" style="margin-left: 10px">预设提示词</div>
            </div>
            <div class="ai-chat-content-box-chat">
              <!-- 支持md 预览 -->
              {{ item.promptContext }}
              <!-- <v-md-preview :text="item.promptContext" @copy-code-success="handleCopyCodeSuccess"></v-md-preview> -->
            </div>
          </div>
        </li>
        <li class="ai-chat-item" :class="item.role + '-item'" v-for="(item, index) of chatList" :key="index" v-show="!item.isNotShowHis">
          <!-- 头像 -->
          <div class="ai-chat-avatar" :class="item.role + '-img'">
            <img v-if="item.role === 'user'" :src="userStoreInfo.img" />
            <img v-if="item.role === 'assistant'" :src="item.icon" />
            <img v-if="item.role === 'system'" src="@/assets/image/llm/0.png" />
          </div>
          <!-- 聊天内容 -->
          <div class="ai-chat-content-box" :class="item.role + '-box'" v-if="item.role === 'user'">
            <div>{{ userName }}</div>
            <div class="ai-chat-content-box-i">
              <div class="ai-chat-content-box-content">
                {{ item.content }}
              </div>
              <div class="ai-chat-content-box-icon" @click="replayRequestion(item)">
                <el-icon size="20" class="icon-color"> <AIcon icon="icon-shuaxin" /> </el-icon>
              </div>
            </div>
          </div>
          <div class="ai-chat-content-box" :class="item.role + '-box'" v-if="item.role === 'assistant'">
            <div class="ai-chat-content-box-assistant-box-flex">
              {{ item.modelName }}
              <img class="ai-chat-content-box-assistant-img2" src="@/assets/image/chat/waiting.png" v-if="item?.loading" />
              <img class="ai-chat-content-box-assistant-img1" src="@/assets/image/chat/final.png" v-else />
            </div>
            <div class="ai-chat-content-box-chat" :class="[!item.extendPro ? 'extendProCss ' : '']">
              <div style="display: flex; justify-content: space-between">
                <span style="color: #005fdb">AI回复内容</span>
                <div>
                  <img v-if="!item.extendPro" @click="scaleContext(item)" src="@/assets/image/llm/u263.png" alt="" />
                  <img v-else @click="scaleContext(item)" src="@/assets/image/llm/u340.png" alt="" />
                </div>
              </div>

              <!-- 支持md 预览 -->
              <div style="display: flex; flex-direction: row; max-width: 100%; overflow: auto; margin-top: -10px">
                <!-- <v-md-preview
                  :text="renderedMarkdown(item.content)"
                  style="max-width: 100%"
                  @copy-code-success="handleCopyCodeSuccess"
                ></v-md-preview> -->
                <v-md-preview-html :html="renderedMarkdown(item.content)" preview-class="vuepress-markdown-body"></v-md-preview-html>
              </div>

              <!-- 加载图标
              <div class="loading-icon-box" v-if="item?.loading">
                <el-icon>
                  <Loading />
                </el-icon>
              </div> -->
              <div class="ai-chat-operate">
                <!--重新回答  -->
                <span class="re-reply-btn" @click="reReply(item, index)" :class="{ disabled: sendBtnDisabled }"> 重新回答 </span>
                <div class="operate-icon-box" :class="{ disabled: sendBtnDisabled }">
                  <!-- 聊天内容复制 -->
                  <el-icon @click="copyRecord(item, index)">
                    <DocumentCopy />
                  </el-icon>
                  <!-- 删除聊天内容 -->
                  <el-icon @click="deleteRecord(index)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </div>
            <div class="ai-chat-content-box-text" v-show="!item?.loading && item.responseTime != null">
              ~{{ item.responseSpeed }} tokens/s | ~{{ item.totalTokens }} tokens | {{ item.responseTime }}s
            </div>
          </div>
        </li>
      </ul>
    </div>

    <ACard class="chat-bottom">
      <template #header>
        <div class="chat-header-box">
          <div class="chat-header-box-text" @click="handleShowPrompt">+新的提示词</div>
          <el-tooltip content="敬请期待" placement="top" effect="light">
            <!-- <el-button>Light</el-button> -->
            <div class="chat-header-box-icon" style="color: #333">
              <el-icon size="20" class="icon-color"> <AIcon icon="icon-wenjian" /> </el-icon>文件
            </div>
          </el-tooltip>
        </div>
      </template>
      <div class="ai-chat-form-wrapper">
        <div class="ai-chat-form-box" ref="chatInputAndFooterRef">
          <el-input
            v-model="problemText"
            type="textarea"
            ref="inputRef"
            resize="none"
            :autosize="{ minRows: 1, maxRows: 5 }"
            placeholder="Enter 发送；Shift+Enter换行"
            @keydown.enter.exact.prevent="sendQuestion"
            @keydown.enter.shift.exact.prevent="problemText += '\n'"
            :maxlength="maxCharCount"
          >
          </el-input>
          <span ref="inputValueRef" style="font-size: 14px; visibility: hidden; padding: 0px 11px; position: absolute">{{ problemText }}</span>
          <div class="content-tips" v-if="isShowLimit">{{ problemText.length }} / {{ maxCharCount }}</div>
          <div class="chat-form-footer" ref="rightToolRef">
            <div class="btns" style="display: flex; flex-direction: column">
              <el-button
                type="primary"
                style="background: none; border: none; padding: 0px 5px; height: 35px; padding-right: 10px"
                :disabled="sendBtnDisabled"
                @click="sendQuestion"
                ><img src="@/assets/image/chat/fasong.png" style="width: 35px; height: 35px"
              /></el-button>
            </div>
          </div>
        </div>
      </div>
    </ACard>
    <div class="other-text">
      所有内容均为AI生成，无法确保真实准确，仅供参考，涉及到专业建议请以专业人士为准；请遵守<a :href="userUrl" target="_blank">《用户协议》</a>及<a
        :href="ysUrl"
        target="_blank"
        >《隐私政策》</a
      >;
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-header {
  margin-left: 10px;
  background: url('@/assets/image/chat/back2.png') no-repeat;
  background-size: 100% 100%;
  border: none;
  border-radius: 0px 10px 0px 0px;
  :deep(.el-card__header) {
    // background-color: #f5f6f7;
    background: none;
    border: none;
  }
  .chat-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
    font-weight: 700;
    .chat-header-box-icon {
      min-width: 280px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 20px;
      .chat-header-box-btn {
        color: #333;
        border: 1px solid #cbcdfe;
        &:hover {
          background: none;
        }
      }
      :deep(.el-select) {
        --el-select-input-focus-border-color: #d7d7d7;
        --el-select-border-color-hover: var(--el-menu-active-bg-color);
      }
      .chat-header-box-icon-text {
        font-weight: bold;
        margin-right: 20px;
      }
      :deep(.el-button) {
        --el-button-hover-bg-color: #fff;
        --el-button-hover-border-color: var(--el-menu-active-bg-color);
        &:focus {
          background-color: #fff;
          border-color: var(--el-border-color);
        }
      }
    }
    .chat-stream {
      display: flex;
      align-items: center;
      span {
        font-weight: normal;
        margin-right: 5px;
      }
    }
  }
  .chat-option-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    .chat-option-box-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 300px;
      font-size: 15px;
      height: 30px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0 10px;
      margin-right: 10px;
      // margin-bottom: 10px;a
      img {
        height: 25px;
      }
    }
  }
  .icon-color {
    color: #aaa;
    cursor: pointer;
  }
}

.ai-chat-view {
  // margin-top: 10px;
  margin-left: 10px;
  display: flex;
  background: #f7f8fa;

  flex-direction: column;
  flex: 1;
  overflow: auto;
  padding-left: 20px;
  // border: 1px solid #d7d7d7;
  // border-radius: 10px;
  .new-year {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    img {
      width: 70%;
      border-radius: 10px;
    }
  }
  .ai-chat-view-his {
    padding: 5px 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .ai-chat-view-his-btn {
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid var(--el-border-color);
      display: flex;
      align-items: center;
      padding: 0px 5px;
      color: #333;
      background-color: var(--el-menu-hover-bg-color);
      &:hover {
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
      }
      .chatLineSquare {
        margin-left: 5px;
        // color: var(--el-menu-active-bg-color);
      }
    }
  }

  //对话列表
  .ai-chat-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    padding: 10px 0 0 0;
    margin: 0px;
    //消除浏览器滚动条
    // &::-webkit-scrollbar {
    //   display: none;
    // }

    //会话项
    .ai-chat-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      // margin-bottom: 40px;
      &.user-item {
        flex-direction: row-reverse;
      }
      &.assistant-item {
      }
    }

    //会话头像
    .ai-chat-avatar {
      &.user-img {
        margin-right: 25px;
      }
      &.assistant-img {
        // margin-right: 5px;
      }
      img {
        // width: 40px;
        height: 30px;
      }
    }

    //会话盒子
    .ai-chat-content-box {
      padding: 10px 15px;
      padding-top: 0px;

      //会话列表用户盒子
      &.user-box {
        // background-color: #fff;
        line-height: 2;
        padding-left: 0;
        padding-top: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .ai-chat-content-box-i {
          display: flex;
          flex-direction: row-reverse;
          align-items: end;
          .ai-chat-content-box-content {
            margin-left: 10px;
            background-color: #fff;
            padding: 5px;
            border-radius: 10px;
            word-wrap: break-word;
            word-break: break-all;
          }
          .ai-chat-content-box-icon {
            cursor: pointer;
          }
        }
      }

      //会话列表ai回复盒子
      &.assistant-box {
        // border-radius: 10px;
        // background: #fff;
        // width: 100%;
        // min-width: 1000px;
        .ai-chat-content-box-chat {
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;

          margin: 10px 0px;
          max-width: 50vw;
          //加载图标盒子
          .loading-icon-box {
            margin-top: -20px;
            .el-icon {
              transform: translate(0, 0);
              animation: rotate 3s linear infinite;
            }

            @keyframes rotate {
              0% {
                transform: translate(0, 0) rotate(0deg);
              }

              100% {
                transform: translate(0, 0) rotate(360deg);
              }
            }
          }

          //会话操作
          .ai-chat-operate {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            margin-top: 10px;
            //重复回答
            .re-reply-btn {
              font-size: 14px;
              color: #005fdb;

              &.disabled {
                color: #ccc;
              }
            }

            //操作图标
            .operate-icon-box {
              display: flex;
              align-items: center;

              .el-icon {
                color: #005fdb;
                font-size: 16px;
                margin-left: 16px;
                cursor: pointer;
              }

              &.disabled .el-icon {
                color: #ccc;
              }
            }
          }
        }
        .extendProCss {
          max-height: 88px;
          overflow: hidden;
        }
        // .no-extendProCss {
        //   // p {
        //   //   width: 100%;
        //   //   overflow: hidden;
        //   //   text-overflow: ellipsis;
        //   //   white-space: nowrap;
        //   // }
        //   ::v-deep .github-markdown-body {
        //     // padding-right: 0px;
        //     p {
        //       max-width: 823px;
        //       overflow: hidden;
        //       text-overflow: ellipsis !important;
        //       white-space: nowrap;
        //     }
        //   }
        // }
      }

      .ai-chat-content-box-assistant-box-flex {
        display: flex;
        // justify-content: center;
        align-items: center;
        .ai-chat-content-box-assistant-img1 {
          width: 25px;
          height: 25px;
          margin-left: 5px;
        }
        .ai-chat-content-box-assistant-img2 {
          width: 25px;
          height: 25px;
          margin-left: 5px;
          animation: donut-spin 1.2s linear infinite;
        }

        @keyframes donut-spin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      }

      .ai-chat-content-box-text {
        color: #aaa;
        font-size: 12px;
      }
    }
  }
}

.chat-bottom {
  margin-left: 10px;
  // margin-bottom: 10px;
  padding-bottom: 5px;
  border-radius: 0;
  border: none;
  // border-top: 1px solid #d7d7d7;
  padding: 0px 10px;
  background: #f7f8fa;

  :deep(.el-card__header) {
    background-color: #f7f8fa;
    border: none;
    padding-left: 5px;
    // border-top: #d7d7d7;
  }
  :deep(.el-card__body) {
    padding: 0px;
  }
  .chat-header-box {
    display: flex;
    align-items: center;
    font-size: 14px;
    .chat-header-box-text {
      width: 100px;
      // border: 1px solid var(--el-menu-active-bg-color);
      height: 30px;
      border-radius: 10px;

      display: flex;
      color: #333;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease-in-out;
      &:hover {
        // border: 1px solid #aaa;
        background: #e0e2ff;
        cursor: pointer;
      }
    }

    .chat-header-box-icon {
      &:hover {
        // border: 1px solid #aaa;
        border-radius: 10px;
        cursor: pointer;
      }
      padding: 0px 10px;
      margin-left: 20px;
      height: 30px;
      width: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  //发送问题表达
  .ai-chat-form-wrapper {
    background-color: #fff;
    border-radius: 15px;

    .ai-chat-form-box {
      // border: 1px solid var(--el-menu-active-bg-color);
      border-radius: 10px;
      display: grid;
      position: relative;
      // overflow-x: hidden;
      overflow: hidden;
      grid-template-areas: 'input-area right-tools';
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;
      border: 2px solid #7663f1b6;
      margin-bottom: 5px;
      .el-textarea {
        grid-area: input-area;
        :deep(.el-textarea__inner) {
          font-size: 14px;
          min-height: 50px !important;
          align-content: center;
          border-radius: 15px;
          box-shadow: none !important;
        }
      }
    }

    //文本域
    // textarea {
    //   width: calc(100vh - 4px);
    //   margin-top: 2px;
    //   padding: 0.5rem 6rem 1rem 1.25rem;
    //   border: none;
    //   outline: none;
    //   resize: none;
    //   border-radius: 10px;
    //   background-color: #fff;
    //   color: #666;
    //   width: 100%;

    //   &::-webkit-scrollbar {
    //     width: 3px;
    //   }
    // }

    //发送问题表单footer
    .chat-form-footer {
      grid-area: right-tools;
      display: flex;
      align-items: end;
      padding-bottom: 8px;
      //内容数字提示
    }
    .content-tips {
      grid-area: left-tools;
      font-size: 14px;
      color: #333;
      width: 100%;
      padding-right: 10px;
      height: 100%;
      align-content: end;
      text-align: end;
      padding-bottom: 5px;
    }
  }
}
.other-text {
  font-size: 14px;
  margin-left: 10px;
  margin-bottom: 10px;
  color: #333;
  a {
    color: var(--el-menu-active-bg-color);
    cursor: pointer;
  }
}
.switch-btn {
  border-radius: 10px;
  color: #333 !important;
  &:focus {
    background: #fff;
  }
}
</style>
