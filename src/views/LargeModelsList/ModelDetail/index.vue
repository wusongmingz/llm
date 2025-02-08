<template>
  <div class="box-contain">
    <div class="box">
      <div class="box-title">
        {{ modelDetailAll.name }}
        <el-icon size="25" class="icon-color" @click="intoModelInfo(0)"> <AIcon icon="icon-fanhui" /> </el-icon>
        <el-icon size="25" class="icon-color" @click="intoChat"> <AIcon icon="icon-liaotian" /> </el-icon>
      </div>
      <div class="box-content">
        <div class="box-content-left">
          {{ modelDetailAll.name }}&nbsp;&nbsp;
          <el-icon size="20" class="icon-color" @click="copyRecord(modelDetailAll.name)"> <AIcon icon="icon-fuzhi" /> </el-icon>&nbsp;&nbsp;
          {{ dayjs(modelDetailAll.updateTime).format('YYYY-MM-DD') }}上架/更新
        </div>
        <div class="box-content-right">
          <img :src="supDetailAll?.icon" alt="" />
          <div class="box-content-right-text">
            <div class="box-content-right-text-top">本模型由{{ modelDetailAll.supplierName }}提供</div>
            <div>模型数量：{{ supDetailAll?.modelList?.length }}</div>
          </div>
          <div class="box-content-right-btn" @click="intoModelInfo(2)">详情></div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="模型介绍" name="first"></el-tab-pane>
          <el-tab-pane label="模型活跃量" name="second"></el-tab-pane>
          <el-tab-pane label="API接口" name="third"></el-tab-pane>
          <el-tab-pane label="明细" name="fourth"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="contain">
      <div class="box1">
        <ModelPresent v-if="activeName === 'first'" />
        <ModelLively v-if="activeName === 'second'" />
        <ModelAPI v-if="activeName === 'third'" />
        <ModelDetails v-if="activeName === 'fourth'" />
      </div>
      <div class="box2">
        <MoreModel @refresh="refresh" :suppers="suppers"></MoreModel>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, h, onMounted, onUpdated, watchEffect, inject, onActivated } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { dayjs, ElMessage } from 'element-plus';
import MoreModel from './MoreModel/index.vue';
import ModelPresent from './ModelPresent/index.vue';
import ModelLively from './ModelLively/index.vue';
import ModelAPI from './ModelAPI/index.vue';
import ModelDetails from './ModelDetails/index.vue';
import { copyToClipboard } from '@/utils/commonUtil';
import { useRouter } from 'vue-router';
import { getSupplierInfo, getMoreModel, getModelInfo } from '@/api/LargeModelsList/modelSearch';
import { getServiceDiffList } from '@/api/UserInformation/information';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const router = useRouter();
const modelDetailAll = <any>inject('modelDetailAll');
const supDetailAll = <any>inject('supDetailAll');
const emit = defineEmits(['changeShowFlag']);
const activeName = ref('first');
const suppers = ref([]);
const handleClick = (tab: TabsPaneContext, event: Event) => {
  //
};
const intoModelInfo = (index: number) => {
  emit('changeShowFlag', index);
};
const intoChat = async () => {
  let isDefaultJump = true;
  const res = await getServiceDiffList({ userId: userId });
  if (res.code === 0) {
    if (res.data) {
      res.data.map((item: any) => {
        if (item.supplierId == supDetailAll.value.supplierId) {
          isDefaultJump = false;
        }
      });
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
  if (isDefaultJump) {
    //修改存储的模型列表
    userStore.modelList = [modelDetailAll.value];
  }
  router.push({ name: '/MultiModelTesting' });
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
//请求大模型厂商
const getSup = async (data: any) => {
  const res = await getSupplierInfo(data);
  if (res.code === 0) {
    if (res.data) {
      supDetailAll.value = res.data;
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
};
//获取更多模型
const getMoreModelList = async (data: any) => {
  const res = await getMoreModel(data);
  if (res.code === 0) {
    if (res.data) {
      suppers.value = res.data;
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
};
const refresh = async (item: any) => {
  const res = await getModelInfo({ modelId: item.id });
  if (res.code === 0) {
    if (res.data) {
      modelDetailAll.value = res.data;
      // intoModelInfo(1);
      getSup({ supplierId: modelDetailAll.value.supplierId });
      getMoreModelList({ modelId: modelDetailAll.value.id });
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
};
onMounted(() => {
  //获取供应商
  getSup({ supplierId: modelDetailAll.value.supplierId });
  //获取更多模型（新）
  getMoreModelList({ modelId: modelDetailAll.value.id });
});
</script>
<style lang="scss" scoped>
.box-contain {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.box {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 15px 15px 0px 15px;
  box-shadow: 0px 0px 5px rgb(137, 129, 248, 0.15);
  .box-title {
    font-size: 28px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .icon-color {
      padding-top: 3px;
      cursor: pointer;
      color: var(--el-menu-active-bg-color);
      margin-left: 20px;
    }
  }
  .box-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .box-content-left {
      color: #7f7f7f;
      font-size: 13px;
      display: flex;
      align-items: center;
      .icon-color {
        color: #7f7f7f;
        cursor: pointer;
      }
    }
    .box-content-right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28.5%;
      height: 100px;
      border-radius: 10px;
      background-color: #eeefff;
      img {
        flex: 2;
        height: 40px;
        margin-left: 10px;
      }
      .box-content-right-text {
        flex: 5.5;
        width: 200px;
        margin-left: 15px;
        color: #555;
        font-size: 16px;
        .box-content-right-text-top {
          margin-bottom: 10px;
          color: #333;
          font-weight: bold;
        }
      }
      .box-content-right-btn {
        flex: 2;
        cursor: pointer;
        color: #333;
        font-size: 14px;
        &:hover {
          color: var(--el-menu-active-bg-color);
        }
      }
    }
  }
}
.contain {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgb(137, 129, 248, 0.15);
  overflow: hidden;
  .box1 {
    background-color: #fff;
    padding: 20px 0px 0px 15px;
    border-radius: 10px;
    width: 70%;
    margin-right: 10px;
    overflow: auto;
  }
  .box2 {
    width: 30%;
    background-color: #fff;
    border-radius: 15px;
    overflow: auto;
    // padding: 20px 0px 0px 15px;
  }
}
</style>
