<template>
  <div>
    <div class="tltle">模型活跃量</div>
    <div class="Ttext">近一周{{ name }}模型活跃量</div>
    <div class="chartbox">
      <div class="chartCss">
        <EchartsWithObserve ref="chartRef" style="height: 400px" :option="chartOption"></EchartsWithObserve>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useOption } from './hook/useOption';
import { ref, inject, onMounted } from 'vue';
const { name, chartOption, getTokenInfo } = useOption();
const modelDetailAll = <any>inject('modelDetailAll');
onMounted(() => {
  getTokenInfo(modelDetailAll.value.id);
  name.value = modelDetailAll.value.name;
});
</script>
<style lang="scss" scoped>
.tltle {
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  margin-right: 15px;
  border-bottom: 1px solid #7f7f7f;
  margin-bottom: 20px;
  .icon-color {
    cursor: pointer;
    color: #7f7f7f;
  }
}
.Ttext {
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.chartbox {
  padding: 30px;
  .chartCss {
    padding: 10px;
    border: 1px solid #d5d2d2;
    border-radius: 10px;
  }
}
</style>
