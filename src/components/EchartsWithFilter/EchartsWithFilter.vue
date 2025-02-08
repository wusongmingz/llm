<template>
  <div class="chart-box">
    <slot name="filter"></slot>
    <div class="chart">
      <el-button-group v-if="props.showFlag" class="button-group">
        <el-button
          v-for="item in dateList"
          style="flex: 1"
          :key="item"
          :label="item"
          @click="handleRadioChange(item)"
          :type="radio === item ? 'primary' : ''"
        >
          {{ item }}
        </el-button>
      </el-button-group>
      <EchartsWithObserve :option="customOption ? customOption(echartOption) : echartOption" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @prop {Map<string, string>} legendList - 图表列表
 * @prop {Record<string, any>[]} data - 数据
 * @prop {[string, string]} dateRange - 日期范围
 * @prop {boolean} showFlag - 折线图按钮是否显示
 *
 * @event dateChange - 点击图表中的按钮触发，返回值为选中的日期数组，选中时，为当前选择日期，取消选中时，返回值为所有日期
 */
import { computed, ref, toRef, watch } from 'vue';
import useChartOption from './hook/useChartOption';
import { getDatesInRange } from '@/utils/timeTools';
import { EChartsOption } from 'echarts';

const radio = ref('');
const props = withDefaults(
  defineProps<{
    legendList: Map<string, string>;
    data: Record<string, any>[];
    dateRange: [string, string];
    unit: string;
    device?: string;
    showFlag?: boolean;
    customOption?: (option: EChartsOption) => EChartsOption;
  }>(),
  {
    showFlag: true,
  },
);
const emits = defineEmits<{
  (e: 'dateChange', v: string[]): void;
}>();
const { option: echartOption } = useChartOption(toRef(props, 'legendList'), toRef(props, 'data'), props.unit);
const dateList = computed(() => {
  return getDatesInRange(props.dateRange[0], props.dateRange[1]);
});
watch([toRef(props, 'dateRange'), toRef(props, 'device')], () => {
  radio.value = '';
});
const handleRadioChange = (value: string) => {
  if (value === radio.value) {
    radio.value = '';
  } else {
    radio.value = value;
  }
  if (radio.value) {
    emits('dateChange', [radio.value]);
  } else {
    emits('dateChange', dateList.value);
  }
};
</script>

<style scoped>
.chart-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chart {
  flex: 1;
  position: relative;
}
.button-group {
  position: absolute;
  width: calc(100% - 40px);
  top: 70px;
  z-index: 2;
  margin: 0 20px;
  display: flex;
  justify-content: left;
  overflow-x: auto;
}
</style>
