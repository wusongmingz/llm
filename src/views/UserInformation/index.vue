<template>
  <div v-loading="isLoading">
    <ACard class="chat-header" style="padding-bottom: 4px">
      <!-- <div class="chat-header-title bold-font">用户信息</div> -->
      <div class="chat-header-body">
        <div class="center-body bold-font first-body" style="">
          <el-icon size="30" class="table-name-icon"> <AIcon icon="icon-gouliangyongliang" /> </el-icon>
          总体用量
        </div>
        <div class="bold-font end-body first-body-number" style="justify-content: flex-start; padding-left: 40px">
          <div class="end-body">{{ tokens }}</div>
          <div class="small-font end-body">Tokens</div>
        </div>
        <div class="first-body-check" @click="jumpTo('/APIBilling')" style="padding-left: 40px">查看使用情况</div>
      </div>
    </ACard>
    <ACard class="chat-header" style="padding-bottom: 22px">
      <div class="chat-header-title bold-font">排除模型供应商</div>
      <div class="chat-center-body">
        <div>
          选择要从处理请求中排除的大模型服务商
          <el-select v-model="excludeService" placeholder="请选择" style="width: 240px">
            <el-option
              @click="addDiffService(item.supplierId)"
              v-for="item in excludeServiceDict"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            >
            </el-option>
          </el-select>
        </div>
        <div class="small-normal-font" v-if="excludeServiceList.length == 0">没有需要排除的大模型供应商</div>
        <div class="item-list" v-else>
          <div class="item-btn" v-for="item in excludeServiceList" :key="item.supplierId">
            {{ item.supplierName }}<el-icon size="12" class="del-icon" @click="delDiffService(item)"> <AIcon icon="icon-shanchu1" /> </el-icon>
          </div>
        </div>
      </div>
    </ACard>
    <ACard class="chat-header">
      <div class="chat-header-title bold-font">默认模型</div>
      <div class="chat-center-body">
        <div>
          默认情况下，应用将使用此模型，该模型的选择可被覆盖
          <el-select v-model="excludeModel" placeholder="请选择" style="width: 240px" @change="changeModel">
            <el-option v-for="item in excludeModelDict" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="small-normal-font">
          单机此处&nbsp;&nbsp;<el-icon size="20" class="table-name-icon" @click="jumpTo('/LargeModelsList')"> <AIcon icon="icon-xuanzeda" /> </el-icon
          >&nbsp;&nbsp;浏览可用型号和价格
        </div>
      </div>
    </ACard>
  </div>

  <!-- <ACard class="chat-header">
    <div class="chat-header-title bold-font">max_tokens设置</div>
    <div class="chat-center-body">
      <div>聊天完成时生成的最大 token数，上下文长度-输入Token大于max_tokens时，输出内容有可能被截取</div>
      <div class="small-normal-font">
        <el-input @change="changeMaxToken(userId, maxToken)" v-model="maxToken" style="width: 240px" placeholder="请输入max_tokens" />
      </div>
    </div>
  </ACard> -->
</template>

<script setup lang="ts">
defineOptions({
  name: '/UserInformation',
});
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useModelList } from './hook/useModelList';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
const router = useRouter();
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const {
  isLoading,
  tokens,
  excludeServiceList,
  excludeService,
  excludeServiceDict,
  excludeModelList,
  excludeModel,
  excludeModelDict,
  getInfoInit,
  changeModelDefault,
  changeService,
  maxToken,
  changeMaxToken,
} = useModelList();

const jumpTo = (str: string) => {
  router.push({ name: str });
};
const addDiffService = (id: number) => {
  for (let index = 0; index < excludeServiceList.value.length; index++) {
    if (excludeServiceList.value[index].supplierId == id) {
      return;
    }
  }
  let str = '';
  for (let i = 0; i < excludeServiceList.value.length; i++) {
    str += excludeServiceList.value[i].supplierId;
    str += '|';
  }
  str += id;

  changeService(userId, str);
};
const delDiffService = (item: any) => {
  //上下联动删除清空
  if (excludeService.value) excludeService.value = '';

  let index = 0;
  for (; index < excludeServiceList.value.length; index++) {
    if (excludeServiceList.value[index].supplierId == item.supplierId) {
      break;
    }
  }
  excludeServiceList.value.splice(index, 1);

  let str = '';
  for (let i = 0; i < excludeServiceList.value.length; i++) {
    str += excludeServiceList.value[i].supplierId;
    if (i != excludeServiceList.value.length - 1) {
      str += '|';
    }
  }

  changeService(userId, str);
};
const changeModel = (item: string) => {
  userStore.modelList = [];
  excludeModelDict.value.forEach((element: any) => {
    if (element.name == item) {
      changeModelDefault(userId, element.id);
    }
  });
};
onMounted(() => {
  getInfoInit(userId);
});
</script>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  margin-bottom: 10px;
  box-shadow: 0px 0px 10px rgba(119, 99, 241, 0.15) !important;
  border: none;
  color: #555;
  .chat-header-title {
    display: flex;
    justify-content: flex-start;
  }
  .chat-header-body {
    display: flex;
    // justify-content: center;
    // align-items: center;
    padding-top: 10px;
    flex: 1.5;
    flex-direction: column;
    .first-body {
      width: 120px;
    }
    .first-body-number {
      margin: 15px 0;
    }
    .first-body-check {
      cursor: pointer;
      color: #7763f1;
      font-size: 13px;
    }
  }
  .chat-center-body {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    flex-direction: column;
    margin-left: 40px;
    height: 130px;
    :deep(.el-select) {
      --el-select-input-focus-border-color: #d7d7d7;
      --el-select-border-color-hover: var(--el-menu-active-bg-color);
    }
  }
}
.bold-font {
  font-size: 20px;
  font-weight: bold;
}
.small-font {
  font-size: 13px;
  font-weight: bold;
  color: #7f7f7f;
}
.small-normal-font {
  font-size: 13px;
  display: inline-flex;
  .table-name-icon {
    color: var(--el-menu-active-bg-color);
    cursor: pointer;
  }
}
.center-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-list {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  .item-btn {
    padding: 0 10px;
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e4e4e4;
    width: 120px;
    height: 30px;
    border-radius: 5px;
    color: #333;
    font-size: 13px;
    .del-icon {
      cursor: pointer;
      color: #7f7f7f;
    }
  }
}

.center-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.end-body {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
</style>
