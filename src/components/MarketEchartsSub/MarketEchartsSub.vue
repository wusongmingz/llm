<script setup lang="ts">
import { onMounted, computed, ref, watch, h } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { ElIcon, ElMessage, dayjs } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import { AIcon, ISearchAction, ISearchForm } from '../AAUI';
import { getSupplyData } from '@/api/marketDynamics/supplyDemand';
import { ILegend } from '@/components/EchartsWithOption/utils';
import { exportToImage } from '@/utils/utils';
import { getMonthsInYearsWithoutNext, getYearsInRange } from '@/utils/timeTools';
export interface IChartOption {
  title: string;
  prop: string;
  url: string;
  xAxisProp: string;
  baseOn?: string;
  showLegend?: boolean;
  unit?: string;
}
export interface ISearchFormWithDefault extends ISearchForm {
  default?: any;
}
const props = withDefaults(
  defineProps<{
    legendList: ILegend[];
    chartList: IChartOption[];
    showDesc?: boolean;
    additionalParam?: ISearchFormWithDefault[];
    sortBy?: string;
  }>(),
  {
    showDesc: true,
    additionalParam: () => [],
  },
);

const additionalParamDefalut = props.additionalParam?.reduce((pre, cur) => ({ ...pre, [cur.prop]: cur.default }), {} as Record<string, any>);
const searchData = ref<Record<string, any>>({
  ...additionalParamDefalut,
  years: [dayjs().format('YYYY')],
  months: [dayjs().format('YYYY-MM')],
  tooltip: props.showDesc
    ? props.legendList
        .map((cur) => {
          if (cur.type === 'area') return '阴影：' + cur.name;
          if (cur.type === 'line') return '线：' + cur.name;
          if (cur.type === 'scatter') return '点：' + cur.name;
          return '';
        })
        .join(' ， ')
    : '',
});
const yearOption = getYearsInRange('2023', dayjs().add(3, 'day').toDate())
  .map((item) => ({ label: item, value: item }))
  .reverse();
const monthOption = computed(() => {
  return getMonthsInYearsWithoutNext(searchData.value.years, 3)
    .map((item) => ({ label: item, value: item }))
    .reverse();
});
watch(
  () => searchData.value.years,
  () => (searchData.value.months = getMonthsInYearsWithoutNext(searchData.value.years, 3)),
);
const searchList = computed<ISearchForm[]>(() => [
  ...props.additionalParam,
  {
    label: '年份',
    prop: 'years',
    type: 'selectWithAll',
    selectOption: { options: yearOption },
    option: { collapseTags: true, collapseTagsTooltip: true },
  },
  {
    label: '年月',
    prop: 'months',
    type: 'selectWithAll',
    selectOption: { options: monthOption.value },
    option: { collapseTags: true, collapseTagsTooltip: true },
  },
  {
    label: '',
    prop: 'tooltip',
    type: 'text',
  },
]);

const chartBox = ref<HTMLElement | null>(null);
const { isFullscreen, toggle } = useFullscreen(chartBox);
const actionList: ISearchAction[] = [
  {
    label: '',
    prop: 'fullScreen',
    type: 'button',
    option: { link: true, icon: () => h(ElIcon, { size: 22 }, () => h(AIcon, { icon: 'icon-quanping' })) },
  },
  {
    label: '',
    prop: 'download',
    type: 'button',
    option: { link: true, icon: () => h(ElIcon, { size: 24 }, () => h(Download)) },
  },
];
const actionHandle = (method: string) => {
  if (method === 'fullScreen') {
    toggle();
  } else {
    if (chartBox.value) {
      exportToImage(chartBox.value);
    }
  }
};

/**
 * Echarts图表所需要的内容
 */
const subData = ref(
  props.chartList.reduce((pre, cur) => {
    pre[cur.prop] = {
      data: [],
      loading: false,
      selected: '',
      getDataFunc: function () {
        subData.value[cur.prop].loading = true;
        const params: Record<string, any> =
          props.additionalParam?.reduce((pre, cur) => ({ ...pre, [cur.prop]: searchData.value[cur.prop] }), {}) || {};
        if (cur.baseOn) {
          params.infoDate = subData.value[cur.baseOn].selected;
        } else {
          params.infoDate = searchData.value.months;
        }
        params.province = '甘肃';
        getSupplyData(cur.url, params)
          .then((res) => {
            if (res.success) {
              subData.value[cur.prop].data = [...(res.data || [])].sort((a, b) => (a[cur.xAxisProp] > b[cur.xAxisProp] ? 1 : -1));
              if (subData.value[cur.prop].data.length > 0) subData.value[cur.prop].selected = subData.value[cur.prop].data[0][cur.xAxisProp];
            } else {
              ElMessage.error(res.msg || '未知错误');
            }
          })
          .finally(() => {
            subData.value[cur.prop].loading = false;
          });
      },
    };
    return pre;
  }, {} as Record<string, { data: any[]; loading: boolean; selected: string; getDataFunc: () => void }>),
);
onMounted(() => {
  getMainData();
});
const getMainData = () => {
  if (props.chartList.length > 0) {
    subData.value[props.chartList[0].prop].getDataFunc();
  }
};

const warchArr: any[] = [];
for (const i in additionalParamDefalut) {
  warchArr.push(() => searchData.value[i]);
}
props.chartList.forEach((item) => {
  if (item.baseOn) {
    watch([() => subData.value[item.baseOn!].selected, ...warchArr], () => {
      subData.value[item.prop].getDataFunc();
    });
  } else {
    watch([() => searchData.value.months, ...warchArr], () => {
      subData.value[item.prop].getDataFunc();
    });
  }
});
</script>

<template>
  <div class="card-box">
    <ACard :bodyStyle="{ paddingBottom: 0 }">
      <ASearchForm :searchList="searchList" :searchData="searchData" :actionList="actionList" @action="actionHandle"></ASearchForm>
    </ACard>
    <div ref="chartBox" :class="isFullscreen ? 'fullscreen-chart-box chart-box' : 'chart-box'">
      <ACard v-for="item in chartList" :key="item.prop" :header="item.title">
        <div v-loading="subData[item.prop].loading" style="height: 400px">
          <EchartsWithOption
            :legendList="props.legendList"
            :data="subData[item.prop].data"
            :showLegend="item.showLegend"
            :unit="item.unit"
            :xAxisProp="item.xAxisProp"
            :sortBy="props.sortBy"
            v-model:selectAxis="subData[item.prop].selected"
          />
        </div>
      </ACard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-box {
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 10px;
  }
  > :last-child {
    margin-bottom: 0;
  }
  .chart-box {
    > * {
      margin-bottom: 10px;
    }
    > :last-child {
      margin-bottom: 0;
    }
  }
}
.fullscreen-chart-box {
  background-color: var(--layout-menu-bg-color);
  height: 100% !important;
  padding: 50px;
  overflow-y: auto;
}
</style>
