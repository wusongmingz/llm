<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <div class="top">
      <span
        class="iconfont icon-ranking"
        style="
          font-size: 25px;
          background: linear-gradient(to top right, #7763f1, #7fbcf9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        "
      ></span>
      <!-- <el-icon size="30" class="table-name-icon"> <AIcon icon="icon-ranking" /> </el-icon> -->
      <h3 style="margin: 0px; padding-top: 5px; margin-left: 20px; font-size: 20px">大语言模型排行榜</h3>
    </div>
    <div :hidePadding="true" class="accumulation-diagram">
      <div class="accumulation-diagram-top">
        <div class="picker-select-class">
          <el-date-picker v-model="selectMonth" type="month" placeholder="选择月份" @change="getMonthData" :popperClass="'select-date'" />
        </div>
        <div style="display: flex; align-items: center">
          <el-icon size="25" class="table-name-icon"> <AIcon icon="icon-bianpinghuatubiaosheji-" /></el-icon>
          <div style="font-size: 13px">&nbsp;&nbsp;月度热门提示词&nbsp;&nbsp;</div>
          <p class="hot-word" v-for="item in hotPromptsList" :key="item">{{ item }}</p>
        </div>
      </div>
      <div class="accumulation-diagram-body">
        <EchartsWithObserve ref="accumulateChartRef" style="height: 100%; width: 100%" :option="accumulateChartOption"></EchartsWithObserve>
      </div>
    </div>
    <div :hidePadding="true" class="bar">
      <div class="bar-top">
        <el-icon size="25" class="table-name-icon"> <AIcon icon="icon-bianpinghuatubiaosheji-" /></el-icon>
        <span style="font-size: 13px">&nbsp;&nbsp;年度热门提示词&nbsp;&nbsp;</span>
        <p class="hot-word" v-for="item in yearHotPromptsList" :key="item">{{ item }}</p>
      </div>
      <ACard class="bar-body">
        <EchartsWithObserve ref="barChartRef" style="height: 100%; width: 100%" :option="barOption"></EchartsWithObserve>
      </ACard>
    </div>
  </div>
</template>

<script setup lang="ts">
import '/src/styles/iconfont/iconfont.css';
import { onMounted, ref, watch } from 'vue';
import { getAccumulateUsageMonthList, getMonthHotPromptList, getYearBarDataList, getYearHotPromptsList } from './hook/useUsageList';
const selectMonth = ref(new Date());
const { getMonthData, accumulateChartOption } = getAccumulateUsageMonthList(selectMonth);
const { getMonthHotList, hotPromptsList } = getMonthHotPromptList(selectMonth, 5);
const { getYearData, barOption } = getYearBarDataList();
const { yearHotPromptsList, getYearHotList } = getYearHotPromptsList();
const accumulateChartRef = ref();
const barChartRef = ref();
defineOptions({
  name: '/ModelUsageList',
});
onMounted(() => {
  getMonthData();
  getMonthHotList();
  getYearData();
  getYearHotList();
});
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  flex: 1;
  max-height: 60px;
  display: flex;
  padding-top: 3px;
  align-items: center;
  padding-left: 15px;
  border-radius: 10px;
  .table-name-icon {
    color: var(--el-menu-active-bg-color);
  }
}
.accumulation-diagram {
  width: 100%;
  flex: 5;
  margin-top: 5px;
  border: none;
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  flex-direction: column;
  box-shadow: 0px 0px 10px rgba(119, 99, 241, 0.15);
  .accumulation-diagram-top {
    // height: 17%;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    // align-items: center;
    // justify-content: center;
    padding-left: 41.7%;
    position: relative;
    .picker-select-class {
      position: absolute;
      left: 1%;
      :deep(.el-input__inner) {
        font-size: 13px;
      }
      :deep(.el-input) {
        --el-input-focus-border-color: var(--el-border-color);
        --el-input-hover-border-color: var(--el-menu-active-bg-color);
      }
    }
    .hot-word {
      background: #e0e2ff;
      height: 30px;
      padding: 0px 5px;
      margin: 0px 4px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      font-size: 13px;
    }
  }
  .accumulation-diagram-body {
    width: 100%;
    flex: 1;
    padding: 10px;
    // border: 1px solid #e0e0e0;
    border-radius: 10px;
  }
}
.bar {
  width: 100%;
  flex: 4;
  margin-top: 8px;
  border: none;
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  flex-direction: column;
  padding-bottom: 8px;
  box-shadow: 0px 0px 10px rgba(119, 99, 241, 0.15);
  .bar-top {
    width: 100%;
    height: 14%;
    max-height: 65px;
    padding: 10px;

    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    // justify-content: center;
    padding-left: 41.7%;

    .hot-word {
      background-color: #e0e2ff;
      height: 30px;
      padding: 0px 5px;
      margin: 0px 4px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      font-size: 13px;
    }
  }
  .bar-body {
    border: none;
    margin-bottom: 0px;
    flex: 1;
  }
}
</style>
