<template>
  <div class="contain">
    <div class="contain-top">
      <div class="contain-top-title">
        <img :src="supDetailAll.icon" alt="" />
        &nbsp;
        <div style="height: 45px; padding-top: 5px">{{ supDetailAll.supplierName }}</div>
        &nbsp;&nbsp;&nbsp;
        <el-icon size="25" class="icon-color" @click="intoModelInfo(0)" style="padding-top: 5px"> <AIcon icon="icon-fanhui" /> </el-icon>
      </div>
      <div class="contain-top-text">
        {{ supDetailAll.introduce }}
      </div>
    </div>
    <div class="contain-center">
      <div class="box-item" v-for="(item, index) in supDetailAll.modelList" :key="index" @click="handleAction(item)">
        <div class="box-item-title">{{ item.name }}</div>
        <div class="box-item-time">更新时间：{{ dayjs(item.updateTime).format('YYYY-MM-DD') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
import { getModelInfo } from '@/api/LargeModelsList/modelSearch';
const supDetailAll = <any>inject('supDetailAll');
const modelDetailAll = <any>inject('modelDetailAll');
const emit = defineEmits(['changeShowFlag']);
const intoModelInfo = (index: number) => {
  emit('changeShowFlag', index);
};
const handleAction = async (item: any) => {
  const res = await getModelInfo({ modelId: item.id });
  if (res.code === 0) {
    if (res.data) {
      modelDetailAll.value = res.data;
      intoModelInfo(1);
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
};
</script>
<style lang="scss" scoped>
.tltle {
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  border-bottom: 1px solid #7f7f7f;
  .icon-color {
    cursor: pointer;
    color: var(--el-menu-active-bg-color);
  }
}
.contain {
  .contain-top {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 5px rgb(137, 129, 248, 0.15);
    padding: 10px 10px 20px 10px;
    margin: 0px 10px;
    .contain-top-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-weight: bold;
      font-size: 28px;
      img {
        height: 50px;
      }
      .icon-color {
        color: var(--el-menu-active-bg-color);
        cursor: pointer;
      }
    }
    .contain-top-text {
      margin-top: 30px;
      text-indent: 2em;
      font-size: 13px;
      color: #333;
      line-height: 20px;
    }
  }
  .contain-center {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
    .box-item {
      cursor: pointer;
      width: 100%;
      height: 90px;
      background-color: #ffffff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // align-items: center;
      padding: 10px;
      border: 1px solid #e0e2ff;
      &:hover {
        background: linear-gradient(to top right, #ffffff, #e0e2ff);
      }
      .box-item-title {
        font-size: 18px;
        font-weight: bold;
        flex: 1;
        display: flex;
        // justify-content: center;
        align-items: center;
      }
      .box-item-time {
        color: #7f7f7f;
        align-self: flex-start;
        font-size: 13px;
      }
    }
  }
}
</style>
