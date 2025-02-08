<template>
  <div class="card-box">
    <div class="card-box-1">
      <div class="card-box-top">
        <div class="card-box1" @click="addNewChat" :class="{ 'card-box1-focus': searchBtn }">
          <el-icon size="30" class="name-icon"> <AIcon icon="icon-jcbchat" /> </el-icon>
          <div style="color: #333">新的聊天+</div>
        </div>
        <div class="card-box2" v-click-outside="() => (searchBtn = false)" :class="{ 'card-box2-focus': searchBtn }">
          <el-icon size="30" class="name-icon2" @click="searchBtn = true">
            <AIcon icon="icon-sousuo" />
          </el-icon>
          <input v-model="inputFilter" type="text" class="search-txt" :class="{ 'search-txt-focus': searchBtn }" />
          <el-icon size="20" @click="clearText" v-if="searchBtn" class="name-icon1">
            <AIcon icon="icon-shanchu1" />
          </el-icon>
        </div>
      </div>
      <!-- 渲染对话列表 -->
      <div class="card-box-first">
        <div
          class="card-box-bottom"
          v-loading="chatListFlag"
          element-loading-background="#f7f8fa"
          v-show="element && element.length > 0"
          v-for="(element, index) in filterChatList"
          :key="index"
        >
          <p style="font-weight: bold">{{ index }}</p>
          <div
            class="card-content"
            v-for="(item, index) in element"
            :style="index < element?.length - 1 ? ' margin-bottom: 20px' : ''"
            :key="index"
            :class="{ active: activeItem == item.conversationId }"
            @click="changeChat(item, index)"
          >
            <el-icon size="15" class="name-icon" @click="deletePromptHandle(item)"> <AIcon icon="icon-shanchu1" /> </el-icon>
            <div class="content-text">{{ item.content }}</div>
            <div class="content-time">{{ item.createTime }}</div>
          </div>
        </div>
      </div>
      <div class="card-content-btn-box">
        <div class="card-content-btn" @click="clearPromptHandle">清空对话列表</div>
      </div>
    </div>

    <div class="card-box-last" v-loading="loadingChat">
      <transition name="slide1">
        <AIChat
          @addChatListFun="addChatListFun"
          v-show="!isShowPrompt"
          @changeLoadingChat="changeLoadingChat"
          @handleShowPrompt="handleShowPrompt"
          @handleShowModelSelect="handleShowModelSelect"
          :chatNew="chatNew"
          ref="aiChatRef"
        ></AIChat>
      </transition>
      <transition name="slide">
        <prompt
          v-show="isShowPrompt"
          :isShowPrompt="isShowPrompt"
          @handleShowPrompt="handleShowPrompt"
          @addNewChat="addNewChat"
          @createPrompt="createPrompt"
          class="prompt-box"
        ></prompt>
      </transition>
      <transition name="move">
        <modelSelect
          v-show="isShowModelSelect"
          @handleShowModelSelect="handleShowModelSelect"
          @addNewChat="addNewChat"
          @createPrompt="createPrompt"
          class="modelSelect-box"
        ></modelSelect>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '/MultiModelTesting',
});
import AIcon from '@/components/AAUI/AIcon/AIcon.vue';
import AIChat from './components/AiChatView.vue';
import prompt from './prompt/index.vue';
import modelSelect from './modelSelect/index.vue';
import { ElIcon, dayjs, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus';
import { onMounted, ref, h, provide } from 'vue';
import { useChatList } from './hook/useChatList';
import { useUserStore } from '@/store/modules/user';
import { useLocalStorage } from '@/utils/storage';
const iconList = ref<any>([]);
const listData = ref<any>([]);
provide('iconList', iconList);
provide('listData', listData);
const storage = useLocalStorage();
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';

const { addHandleSync, getList, chatList, filterChatList, chatListFlag, chatNew, clearChatList, delChatContext, inputFilter } = useChatList();
const clearText = () => {
  inputFilter.value = '';
};
//聊天框加载
const loadingChat = ref(false);
//AI聊太
const aiChatRef = ref();
//搜索框按钮
const searchBtn = ref(false);

const activeItem = ref('');
const changeChat = (item: any, index: number) => {
  // console.log(filterChatList.value);
  // console.log(item);
  activeItem.value = item.conversationId;
  chatNew.value.conversationId = item.conversationId;
  chatNew.value.sessionId = item.sessionId;
};
// const chatList = ref<any>([]);
const isShowPrompt = ref<boolean>(false);
const isShowModelSelect = ref<boolean>(false);
const addNewChat = async () => {
  loadingChat.value = true;
  await addHandleSync({ userId }).then((res: any) => {
    loadingChat.value = false;
    // getList(userId);
    //创建新聊天，清空右侧面板

    //选中状态变更
    activeItem.value = res?.data?.conversationId;
  });
  // chatList.value.push({
  //   require: false,
  //   time: dayjs().format('YYYY-MM-DD HH:mm'),
  //   content: '',
  // });
};
const handleShowPrompt = (status: boolean) => {
  isShowPrompt.value = status;
};
const handleShowModelSelect = (status: boolean) => {
  isShowModelSelect.value = status;
};
const changeLoadingChat = (flag: boolean) => {
  loadingChat.value = flag;
};

//删除
const deletePromptHandle = (item: any) => {
  ElMessageBox.confirm('确认删除对话吗？', '操作确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delChatContext(item.conversationId).then(() => {
        getList(userId).then(() => {
          if (chatList.value.length > 0) {
            activeItem.value = chatList.value[0].conversationId;
          } else {
            addNewChat();
          }
        });
      });
    })
    .catch(() => {
      //取消删除回馈
    });
};

//清空
const clearPromptHandle = () => {
  ElMessageBox.confirm('是否确认清空对话列表？', '操作确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      clearChatList().then(() => {
        getList(userId);
        addNewChat();
      });
    })
    .catch(() => {
      //取消删除回馈
    });
};
interface ChatDataMap {
  [data: string]: any[];
}

//添加聊天列表方法
const addChatListFun = (data: any) => {
  const todayKey = '今天';
  for (let i = 0; i < chatList?.value?.[todayKey]?.length; i++) {
    if (chatList?.value?.[todayKey][i].conversationId == data.conversationId) {
      return;
    }
  }

  if (Object.prototype.hasOwnProperty.call(chatList.value, todayKey)) {
    chatList.value[todayKey].unshift(data);
  } else {
    // chatList.value[todayKey] = [data];
    const temp: ChatDataMap = {};
    temp[todayKey] = [data];
    for (const key in chatList.value) {
      if (key !== todayKey) {
        temp[key] = chatList.value[key];
      }
    }
    chatList.value = temp;
  }

  // chatList.value.push(data);
};

const createPrompt = async (data: any) => {
  //添加新聊天框
  await addNewChat();
  //左侧添加对话框
  // chatList.value.push({
  //   conversationId: chatNew.value.conversationId,
  //   sessionId: chatNew.value.sessionId,
  //   content: data.length === 0 ? '' : data[0].promptContext,
  //   createTime: dayjs().format('YYYY-MM-DD HH:mm'),
  // });
  //设置缓存存本地
  storage.set(chatNew.value.conversationId, data);
  aiChatRef.value.promptCreate(data);
};

onMounted(() => {
  loadingChat.value = true;
  getList(userId).then(() => {
    //【11.27】点击路由直接创建新对话
    // if (chatList.value.length == 0) {
    addNewChat();
    // } else {
    //   //选中状态，选中第一个
    //   activeItem.value = chatList.value[0].conversationId;
    // }
  });
});
</script>

<style lang="scss" scoped>
.card-box {
  display: flex;
  height: 100%;
  background-color: var(--layout-bg-color);
  border-radius: 10px;
  overflow: hidden;
  // border: 1px solid #d7d7d7;
  .card-box-1 {
    display: flex;
    flex-direction: column;
    background: #fff;
    .card-box-top {
      display: flex;
      width: 100%;
      justify-content: center;
      height: 77px;
      align-items: center;
      padding-bottom: 5px;
      .card-box1 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        border: 1px solid #aaa;
        border-radius: 15px;
        height: 50px;
        white-space: nowrap;
        font-weight: 700;
        transition: 0.4s;
        .name-icon {
          margin-right: 10px;
          color: var(--el-menu-active-bg-color);
        }
        &:hover {
          border: 1px solid var(--el-menu-active-bg-color);
          cursor: pointer;
        }
      }
      .card-box1-focus {
        width: 0px;
        opacity: 0;
        visibility: hidden;
      }
      .card-box2 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 5px;
        height: 50px;
        width: 50px;
        transition: 0.4s;
        .name-icon2 {
          margin-left: 3px;
          color: var(--el-menu-active-bg-color);
        }
        .name-icon1 {
          margin-right: 3px;
          cursor: pointer;
          color: #aaa;
        }
        &:hover {
          cursor: pointer;
          border-radius: 10px;
          background-color: #f0f1ff;
        }
        .search-txt {
          border: none;
          background: none;
          outline: none;
          padding: 0;
          color: #222;
          font-size: 16px;
          line-height: 40px;
          width: 0;
          transition: 0.4s;
        }

        .search-txt-focus {
          width: 155px;
          padding: 0 5px;
        }
      }
      .card-box2-focus {
        width: 210px;
        border-radius: 10px;
        border: 1px solid #7763f1;
        background-color: #f0f1ff;
      }
      // .card-box2:hover .search-txt {
      //   width: 200px;
      //   padding: 0 12px;
      // }
      // .card-box1:has(+ .card-box2:hover) {
      //   width: 0px;
      //   opacity: 0;
      //   // display: none;
      // }
    }
    .card-box-first {
      flex: 1;
      overflow-y: scroll;

      display: flex;
      flex-direction: column;
      padding: 20px;
      padding-top: 0px;
      overflow-x: hidden;
      min-width: 180px;
      width: 250px;

      .card-box-bottom {
        // flex: 1;
        // margin-top: 20px;
        display: flex;
        flex-direction: column;

        justify-content: flex-start;
        align-items: left;
        .card-content {
          display: flex;
          width: 100%;
          height: 60px;
          justify-content: center;
          align-items: left;
          border: 1px solid #d7d7d7;
          transition: all 0.2s ease-in-out;
          border-radius: 10px;
          flex-direction: column;
          font-size: 13px;
          padding: 3px 3px 5px 10px;
          cursor: pointer;
          background-color: #fff;
          &:hover {
            // border: 1px solid var(--el-menu-active-bg-color);
            background: url('@/assets/image/chat/history.png') no-repeat;
            background-size: cover;
            border: 1px solid #7763f1;
          }
          .name-icon {
            align-self: end;
            color: #aaa;
          }
          .content-text {
            overflow: hidden;
            color: #333;
            /* 显示省略符号来代表被修剪的文本。 */
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .content-time {
            font-size: 10px;
            align-self: baseline;
            color: #7f7f7f;
          }
        }
        .active {
          // background-color: #edf1f4;
          background: url('@/assets/image/chat/history.png') no-repeat;
          background-size: cover;
          border: 1px solid #7763f1;

          // border: 1px solid var(--el-menu-active-bg-color);
        }
      }
    }
    .card-content-btn-box {
      padding: 10px 20px;
      width: 100%;
      height: 60px;
      .card-content-btn {
        background-color: #fff;
        display: flex;
        justify-content: center;
        color: #333;
        align-items: center;
        height: 40px;
        border-radius: 10px;
        border: 1px solid #d7d7d7;
        &:hover {
          cursor: pointer;
          background-color: var(--el-menu-hover-bg-color);
          color: #333;
        }
      }
    }
  }

  .card-box-first::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.3);   */
    border-radius: 20px; /* 滚动条的背景区域的圆角 */
    background-color: #f2f2f2;
  }
  .card-box-first::-webkit-scrollbar-thumb {
    border-radius: 20px; /* 滚动条的圆角 */
    /* -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,.3);   */
    background-color: #d7d7d7;
  }
  .card-box-last {
    // position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    // border-radius: 15px;
  }
}
.prompt-box {
  // position: absolute;
  height: 100%;
  // width: 100%;
  flex: 1;
  min-height: 100%;
  // z-index: 2;
}
.modelSelect-box {
  position: absolute;
  // height: 100%;
  // width: 100%;
  height: 480px;
  // width: 1000px;
  width: 72%;
  left: 400px;
  z-index: 1;
  padding-bottom: 10px;
}

//底部滑入动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  // height: 0;
  transform: translateY(100%);
}
.slide1-enter-active,
.slide1-leave-active {
  transition: all 0.8s ease;
}
.slide1-enter-from,
.slide1-leave-to {
  opacity: 0;
  // height: 0;

  transform: translateY(-100%);
}
// .slide-enter-active {
//   animation: top-change 0.5s;
// }
// .slide-leave-active {
//   animation: top-change 0.5s reverse;
// }
@keyframes top-change {
  0% {
    bottom: -100%;
  }
  100% {
    bottom: 0%;
  }
}
//上方滑入动画
.move-enter-active {
  animation: top-change1 0.5s;
}
.move-leave-active {
  animation: top-change1 0.5s reverse;
}
@keyframes top-change1 {
  0% {
    // top: -5%;
    height: 0;
  }
  100% {
    // top: 0%;
    height: 500px;
  }
}
</style>
