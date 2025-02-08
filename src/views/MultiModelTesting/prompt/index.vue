<template>
  <div>
    <ACard class="chat-header">
      <template #header>
        <div class="chat-header-box">
          <div class="chat-header-box-text">预设提示词</div>
          <el-icon size="40" @click="handleShowPrompt" style="cursor: pointer">
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="contain-box">
        <div class="search">
          <el-input
            clearable
            width="950"
            maxlength="950"
            size="large"
            :prefix-icon="() => h(ElIcon, { color: '#7763f1', size: 25 }, { default: () => h(AIcon, { icon: 'icon-sousuo' }) })"
            v-model="inputFilter"
          >
          </el-input>
          <div class="search-add" @click="actionHandle('create')">新建+</div>
        </div>
        <div class="btn-all">
          <div class="btn-search" :class="{ active: allItem === item }" v-for="(item, index) in tableTag" :key="index" @click="changeTag(item)">
            {{ item }}
          </div>
        </div>
        <ACard class="prompt" v-loading="tableDataLoading">
          <div class="prompt-box" v-for="(item, index) in filterTableDate(inputFilter)" :key="index">
            <div class="prompt-box-title">
              <div class="prompt-box-title-top">{{ item.promptTitle }}</div>
              <div class="prompt-box-title-bottom">包含{{ item.promptDetailDoList.length }}条预设对话</div>
            </div>
            <div class="prompt-box-text">
              <div class="prompt-box-text-innner">
                {{ getStrFliter(item) }}
              </div>
            </div>
            <div class="prompt-box-operation">
              <div class="icon">
                <div class="icon-div" @click="chatByPrompt(item)">
                  <el-icon size="20" class="icon-color"> <AIcon icon="icon-duihuazixun" /> </el-icon>
                  对话
                </div>
                <div class="icon-div" @click="actionHandle('edit', item)">
                  <el-icon size="20" class="icon-color"> <AIcon icon="icon-bianji" /> </el-icon>
                  编辑
                </div>
                <div class="icon-div" @click="deletePromptHandle(item)" v-if="!item.isSystem">
                  <el-icon size="20" class="icon-color"> <AIcon icon="icon-shanchu" /> </el-icon>
                  删除
                </div>
              </div>
            </div>
          </div>
        </ACard>
      </div>
    </ACard>

    <ADialog :title="adialogTitle" v-model:isShow="isShowEditDialog" :option="{ width: '900px', appendToBody: true }" hideAction>
      <div class="from-box" v-loading="editFormLoading">
        <el-form :model="editFormData" ref="editFormRef" :rules="editFormRules">
          <el-form-item prop="promptTitle">
            <el-input v-model="editFormData.promptTitle" style="width: 100%" maxlength="30" placeholder="请输入标题" show-word-limit type="text" />
          </el-form-item>
          <draggable :list="editFormData.promptDetailDoList" item-key="id" animation="300">
            <template #item="{ element, index }">
              <el-form-item prop="promptDetailDoList">
                <div class="from-item">
                  <el-icon size="20" class="icon-color"> <AIcon icon="icon-yidong" /> </el-icon>
                  <el-select class="item-select" v-model="element.role" placeholder="Select" size="default">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2 }" v-model="element.promptContext" ize="large" class="item-input" />
                  <div class="item-btn" @click="delBtn(index)">
                    <el-icon size="20" class="icon-color"> <AIcon icon="icon-shanchu1" /> </el-icon>
                  </div>
                </div>
              </el-form-item>
            </template>
          </draggable>
          <el-form-item>
            <div class="add-icon">
              <el-icon size="20" class="icon-color" @click="addBtn"> <AIcon icon="icon-xinzeng" /> </el-icon>
            </div>
          </el-form-item>
        </el-form>
        <!-- <AForm ref="editFormRef" class="form" v-loading="editFormLoading" :list="editFormList" :data="editFormData" :rules="editFormRules" /> -->
        <div class="from-footer">
          <el-button class="from-footer-btn1" @click="isShowEditDialog = false">取消</el-button>
          <el-button class="from-footer-btn2" @click="updateList">保存</el-button>
        </div>
      </div>
    </ADialog>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue';
import { ref, h, onMounted, onUpdated, watchEffect } from 'vue';
import AIcon from '@/components/AAUI/AIcon/AIcon.vue';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { useEdit } from './hook/useEdit';
import draggable from 'vuedraggable';
import { useUserStore } from '@/store/modules/user';
const props = defineProps(['isShowPrompt']);
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';

const $emit = defineEmits(['handleShowPrompt', 'addNewChat', 'createPrompt']);
const handleShowPrompt = () => {
  $emit('handleShowPrompt', false);
};
const inputSearch = ref('');
const allItem = ref('全部');
const allList = ref([
  {
    name: '全部',
  },
  {
    name: '自定义',
  },
  {
    name: '金融',
  },
]);

const value = '';
const input = '';

const roleOptions = [
  {
    value: 'system',
    label: 'system',
  },
  {
    value: 'user',
    label: 'user',
  },
  {
    value: 'assistant',
    label: 'assistant',
  },
];

const domains = [
  {
    key: 'key1',
    value: 'value1',
  },
  {
    key: 'key2',
    value: 'value2',
  },
];
//创建更新弹框
const adialogTitle = ref<string>('预设提示词');
const adialogBtn = ref<string>('保存');
const {
  editFormRef,
  editFormList,
  editFormData,
  editFormLoading,
  editFormRules,
  addHandleSync,
  editHandleSync,
  // deleteHandleSync,
  isShowEditDialog,
  // isCreated,
  // key_textarea,

  inputFilter,
  filterTableDate,
  getTableList,
  getStrFliter,
  tableDataLoading,
  deletePrompt,

  tableTag,
  getTableTag,
} = useEdit();

//获取提示词
const updatePromptList = () => {
  // getTableList(userId)
  getTableTag();
  getTableList(userId, allItem.value);
};
//增加条数按钮
const addBtn = () => {
  editFormData.value.promptDetailDoList.push({
    createBy: userId,
    promptContext: '',
    promptTitle: '',
    role: '',
    seq: '',
  });
};
//删除按钮
const delBtn = (index: number) => {
  editFormData.value.promptDetailDoList.splice(index, 1);
};
//创建更新弹框-接口调用
const updateList = () => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (adialogTitle.value == '预设提示词') {
        //设置顺序
        editFormData.value.promptDetailDoList.map((item: any, index: number) => {
          item.seq = index;
          item.promptTitle = editFormData.value.promptTitle;
        });
        addHandleSync(editFormData.value).then(() => {
          getTableList(userId, allItem.value);
          isShowEditDialog.value = false;
        });
      } else {
        //设置顺序
        editFormData.value.promptDetailDoList.map((item: any, index: number) => {
          item.seq = index;
          item.promptTitle = editFormData.value.promptTitle;
        });
        editHandleSync(editFormData.value).then(() => {
          getTableList(userId, allItem.value);
          editFormLoading.value = false;
          isShowEditDialog.value = false;
        });
      }
    }
  });

  return;
};
const chatByPrompt = async (item: any) => {
  //关闭弹框
  handleShowPrompt();
  //调用AIchat里的方法
  $emit('createPrompt', item.promptDetailDoList);
};
//tag变化
const changeTag = (item: string) => {
  allItem.value = item;
  getTableList(userId, item);
};

//弹出动作
const actionHandle = (action: string, data?: any) => {
  //创建弹出
  if (action === 'create') {
    // nextTick(() => {
    isShowEditDialog.value = true;
    // });
    editFormData.value = {
      userId: userId,
      promptTitle: '',
      promptDetailDoList: [
        {
          createBy: userId,
          promptContext: '',
          promptTitle: '',
          role: '',
          seq: 0,
        },
      ],
    };
    adialogTitle.value = '预设提示词';
    adialogBtn.value = '保存';
  } else if (action === 'edit') {
    isShowEditDialog.value = true;
    adialogTitle.value = '编辑提示词';
    adialogBtn.value = '保存';
    editFormData.value = JSON.parse(JSON.stringify(data));
  } else {
    //查看弹窗
  }
};

const deletePromptHandle = (item: any) => {
  ElMessageBox.confirm('确认删除对话吗？', '操作确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      //删除
      const data = {
        user: userId,
        titleId: item.titleId,
      };
      deletePrompt(data).then(() => {
        getTableList(userId, allItem.value);
      });
    })
    .catch(() => {
      //取消删除回馈
    });
};

watchEffect(() => {
  if (props.isShowPrompt) {
    updatePromptList();
  }
});
</script>

<style lang="scss" scoped>
.chat-header {
  margin-left: 10px;
  height: 100%;
  border: 1px solid #d7d7d7;
  border-radius: 10px;
  :deep(.el-card__header) {
    border-bottom: 1px solid #d7d7d7;
    // border: none;
    padding: 20px;
  }
  .chat-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .chat-header-box-text {
      font-size: 18px;
      font-weight: 700;
    }
  }

  .contain-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    .search {
      width: 1000px;
      display: flex;
      :deep(.el-input) {
        --el-input-border-color: #d7d7d7;
        --el-border-color-hover: var(--el-menu-active-bg-color);
        --el-border-radius-base: 10px;
      }
      .search-add {
        font-weight: 700;
        font-size: 16px;
        width: 150px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d7d7d7;
        border-radius: 10px;
        margin-left: 30px;
        &:hover {
          border: 1px solid var(--el-menu-active-bg-color);
          background-color: var(--el-menu-hover-bg-color);
          // color: var(--el-menu-active-bg-color);
          cursor: pointer;
        }
      }
    }
    .btn-all {
      display: flex;
      align-self: flex-start;
      flex-flow: wrap;
      height: 40px;
      .btn-search {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 70px;
        height: 30px;
        background-color: var(--el-menu-hover-bg-color);
        color: #000;
        border-radius: 10px;
        margin: 5px;
      }
      .active {
        color: #fff;
        background-color: var(--el-menu-active-bg-color);
      }
    }
    .prompt {
      width: 100%;
      flex: 1;
      display: flex;
      border: 1px solid #d7d7d7;
      // box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.1);
      .prompt-box {
        margin: 5px 20px 5px 20px;
        background-color: var(--layout-bg-color);
        border-radius: 5px;
        height: 80px;
        display: flex;
        .prompt-box-title {
          width: 400px;
          display: flex;
          flex-direction: column;
          margin-left: 30px;
          .prompt-box-title-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 50px;
          }
          .prompt-box-title-bottom {
            font-size: 13px;
            color: #7f7f7f;
          }
        }
        .prompt-box-text {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .prompt-box-text-innner {
            overflow: hidden;
            /* 显示省略符号来代表被修剪的文本。 */
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            width: 325px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
        }
        .prompt-box-operation {
          width: 400px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .icon {
            display: flex;
            flex-direction: row;
            .icon-div {
              width: 65px;
              height: 30px;
              margin-right: 20px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              cursor: pointer;
              &:hover {
                border-radius: 10px;
                background: var(--el-menu-hover-bg-color);
              }
              .icon-color {
                color: var(--el-menu-active-bg-color);
              }
            }
          }
        }
      }
    }
  }
}
.from-box {
  display: flex;
  min-height: 460px;
  flex-direction: column;
  justify-content: space-between;
  :deep(.el-input) {
    --el-input-focus-border-color: #d2d6da;
    --el-input-focus-border: #d2d6da;
    --el-input-border-color: #d2d6da;
    --el-border-color-hover: #d2d6da;
    --el-border-radius-base: 10px;
  }
  .from-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0px;
    width: 100%;
    :deep(.el-input) {
      --el-input-focus-border-color: #d2d6da;
      --el-input-focus-border: #d2d6da;
      --el-input-border-color: #d2d6da;
      --el-border-color-hover: #d2d6da;
      --el-border-radius-base: 10px;
    }
    :deep(.el-textarea) {
      --el-input-focus-border-color: #d2d6da;
    }
    :deep(.el-select) {
      --el-select-input-focus-border-color: #d2d6da;
    }
    .item-select {
      width: 150px;
      margin: 0px 20px;
    }
    .item-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      color: var(--el-menu-active-bg-color);
      border: 1px solid #aaa;
      border-radius: 10px;
      margin-left: 10px;
      .icon-color {
        color: var(--el-menu-active-bg-color);
      }
      &:hover {
        cursor: pointer;
        background-color: var(--el-menu-hover-bg-color);
      }
    }
    .item-input {
      flex: 1;
      border: 1px solid #d5d2d2;
      border-radius: 5px;
    }
  }
  .add-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .icon-color {
      color: var(--el-menu-active-bg-color);
      cursor: pointer;
    }
  }

  .from-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    // border-top: 1px solid #d7d7d7;
    .from-footer-btn1 {
      height: 30px;
      font-size: 12px;
      width: 80px;
      background: #fff;
      color: #999;
      border-radius: 5px;
      border: 1px solid #999;
      right: 0%;
    }
    .from-footer-btn2 {
      height: 30px;
      font-size: 12px;
      width: 80px;
      background: var(--el-menu-active-bg-color);
      color: #fff;
      border-radius: 5px;
      right: 0%;
    }
  }
}
</style>
