<template>
  <ACard class="card">
    <div class="card-header">
      <div class="card-header-info">
        <div style="font-size: 36px; padding-left: 140px">API-Keys</div>
        <el-button class="card-header-info-btn" @click="actionHandle('create')">创建API-Key</el-button>
      </div>
    </div>
    <div class="card-text">通过天元大模型网关接入所有的大模型，并管理你的密钥</div>
    <ATable class="edit-table" :tableHead="tableHead" :tableData="tableData" :tableConfig="tableConfig" :loading="tableLoading" :height="585">
      <template #keyName="{ data }">
        <div>
          <div class="table-name">{{ data.keyName }}</div>
          <div class="table-name-Tokens">{{ data.tokenUsed }}Tokens</div>
        </div>
      </template>
      <template #apiKey="{ data }">
        <div>{{ data.apiKey.substr(0, 5) }}...{{ data.apiKey.substr(-4) }}</div>
      </template>
      <template #do="{ data }">
        <div class="icon">
          <div class="icon-div" @click="actionHandle(tableActionList[0].prop, data)">
            <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[0].icon" /> </el-icon>
            {{ tableActionList[0].label }}
          </div>
          <div class="icon-div" @click="actionHandle(tableActionList[1].prop, data)">
            <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[1].icon" /> </el-icon>
            {{ tableActionList[1].label }}
          </div>
          <el-popover :visible="data.visible" placement="top" :width="250">
            <p style="display: flex">
              <el-icon size="20" class="popover_icon">
                <!-- <arrow-down /> -->
                <AIcon icon="icon-gantanhao" /> </el-icon
              >是否确认删除？
            </p>
            <div class="popover_btn">
              <el-button size="small" class="popover_btn1" @click="hiddenPopver(data)">取消</el-button>
              <el-button size="small" class="popover_btn2" @click="deletePopver(data)">确认</el-button>
            </div>
            <template #reference>
              <div class="icon-div" @click="actionHandle(tableActionList[2].prop, data)" v-click-outside="() => (data.visible = false)">
                <el-icon size="20" class="icon-color"> <AIcon :icon="tableActionList[2].icon" /> </el-icon>
                {{ tableActionList[2].label }}
              </div>
            </template>
          </el-popover>
        </div>
      </template>
    </ATable>
  </ACard>
  <ADialog :title="adialogTitle" v-model:isShow="isShowEditDialog" :option="{ width: '30%', center: true }" hideAction>
    <div v-if="!isCreated">
      <AForm ref="editFormRef" class="form" v-loading="editFormLoading" :list="editFormList" :data="editFormData" :rules="editFormRules" />
      <div class="from-footer">
        <el-button class="from-footer-btn" @click="updateList">{{ adialogBtn }}</el-button>
      </div>
    </div>
    <div v-else class="key_show">
      <div>您的新密钥：</div>
      <div class="key_show_info">
        <el-input :autosize="{ minRows: 4 }" type="textarea" :rows="2" disabled v-model="key_textarea" class="key_show_info_input" />
        <el-icon size="20" style="cursor: pointer" @click="copyRecord(key_textarea)"><AIcon icon="icon-fuzhi"></AIcon></el-icon>
      </div>
      <div class="key_show_info_text">
        请立即复制并记在安全的地方。您将无法再次看到它。<span
          >你可以将其与OpenAI兼容的应用程序或<span class="key_show_info_text_owner" @click="jumpRouter">您自己的代码</span>一起使用</span
        >
      </div>
    </div>
  </ADialog>

  <Detail ref="childRef" :apiKey="apiKey"></Detail>
</template>

<script setup lang="ts">
defineOptions({
  name: '/APIManagement',
});

import { useList } from './hook/useList';
import { useEdit } from './hook/useEdit';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox, ClickOutside as vClickOutside } from 'element-plus';
import { onMounted, ref, watchEffect, nextTick } from 'vue';
import Detail from './components/Detail.vue';
import { useRouter } from 'vue-router';
import { copyToClipboard } from '@/utils/commonUtil';
import { useUserStore } from '@/store/modules/user';
const router = useRouter();
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const { tableHead, tableData, tableActionList, tableConfig, tableLoading, getTableList } = useList();
const {
  editFormRef,
  editFormList,
  editFormData,
  editFormLoading,
  editFormRules,
  addHandleSync,
  editHandleSync,
  deleteHandleSync,
  isShowEditDialog,
  isCreated,
  key_textarea,
} = useEdit();

const adialogTitle = ref<string>('创建密钥');
const adialogBtn = ref<string>('创建');
const apiKey = ref('');
const apiKeyName = ref('');
//查看弹窗
const checkAdialog = ref(false);
const childRef = ref();
//弹出动作
const actionHandle = (action: string, data?: any) => {
  //创建弹出
  if (action === 'create') {
    // nextTick(() => {
    isShowEditDialog.value = true;
    // });
    editFormData.value = {};
    adialogTitle.value = '创建密钥';
    adialogBtn.value = '创建';
  } else if (action === 'edit') {
    isShowEditDialog.value = true;
    // editFormData.value = data;
    adialogTitle.value = '编辑密钥';
    adialogBtn.value = '提交';
    // nextTick(() => {
    editFormData.value = JSON.parse(JSON.stringify(data));
    // });
  } else if (action === 'remove') {
    data.visible = true;
  } else {
    //查看弹窗
    if (childRef.value) {
      apiKey.value = data.apiKey;
      childRef.value.apikeyName = data.keyName;
      childRef.value.checkAdialog = true;
    }
  }
};
//删除动作
const hiddenPopver = (data: any) => {
  data.visible = false;
};
const deletePopver = (data: any) => {
  //调用删除接口
  deleteHandleSync(data.apiKey).then(() => {
    getTableList(userId); //传入的userId todo
    data.visible = false;
  });
};
//复制功能
const copyRecord = (item: string) => {
  const content = item;
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

//接口调用
const updateList = () => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (adialogBtn.value == '创建') {
        addHandleSync().then(() => {
          getTableList(userId); //传入的userId todo
          isCreated.value = true;
          // isShowEditDialog.value = false;
        });
      } else {
        editHandleSync().then(() => {
          getTableList(userId); //传入的userId todo
          // isCreated.value = true;
          isShowEditDialog.value = false;
        });
      }
    }
  });

  return;
};

//跳转使用指南
const jumpRouter = () => {
  router.push({ name: '/UsageGuide' });
};

watchEffect(() => {
  if (!isShowEditDialog.value) {
    isCreated.value = false;
    key_textarea.value = '';
  }
});

onMounted(() => {
  getTableList(userId); //传入的userId todo
});
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  background: none;
  border: none;
  padding: 74px 80px 20px 100px;
  .card-header {
    &::after {
      content: '';
      width: 50%;
      height: 300px;
      position: absolute;
      background: url('@/assets/image/manage/apimanage.png') no-repeat;
      top: 70px;
      left: 300px;
    }
    padding-bottom: 10px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 2px solid;
    border-image: linear-gradient(to right, #345cfd, #b670c9, #8b81f7) 1;
    .card-header-info {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-header-info-btn {
        height: 40px;
        font-size: 20px;
        width: 200px;
        background: linear-gradient(to top right, #7763f1, #b172cf);
        color: #fff;
        border-radius: 10px;
        font-weight: bold;
      }
    }
  }
  .card-text {
    font-size: 14px;
    color: #7f7f7f;
    margin-top: 22px;
    margin-bottom: 40px;
  }
}
.edit-table {
  :deep(.el-table) {
    border-radius: 10px;
    --el-table-row-hover-bg-color: none;
    --el-table-current-row-bg-color: none;

    --el-text-color-regular: #333333;

    --el-fill-color-lighter: none;
  }
  .table-name {
    font-size: 14px;
    padding-bottom: 5px;
    color: #333333;
  }
  .table-name-Tokens {
    font-size: 11px;
    color: #7f7f7f;
  }
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
.form {
  display: flex;
  flex-direction: column;
  :deep(.el-input__wrapper) {
    background-color: #f5f6f7;
  }
}
.from-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
  border-top: 1px solid #d7d7d7;
  .from-footer-btn {
    height: 32px;
    font-size: 14px;
    width: 100px;
    background: var(--el-menu-active-bg-color);
    color: #fff;
    border-radius: 10px;
    font-weight: bold;
    right: 0%;
  }
}
.key_show {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #333333;
  .key_show_info {
    display: flex;
    justify-content: center;
    align-items: end;
    width: 90%;
    margin-bottom: 10px;
    font-size: 13px;
    .key_show_info_input {
      margin: 10px 10px 0px 10px;
    }
  }
  .key_show_info_text {
    font-weight: bold;
    text-indent: 2em;
    margin: 10px;
    span {
      font-weight: normal;
    }
    .key_show_info_text_owner {
      cursor: pointer;
      color: #1482c5;
    }
  }
}
.popover_icon {
  color: #ff7d00;
  margin-right: 10px;
}
.popover_btn {
  display: flex;
  justify-content: end;
  .popover_btn1 {
    background-color: var(--layout-bg-color);
    color: #1d2129;
    font-size: 13px;
  }
  .popover_btn2 {
    background-color: var(--el-menu-active-bg-color);
    color: #fff;
    font-size: 13px;
  }
}
::v-deep .el-dialog {
  border-radius: 10px !important;
}
</style>
