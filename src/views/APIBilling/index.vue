<template>
  <div class="container">
    <ACard class="container1">
      <ASearchForm class="container-select" :searchList="searchList" v-model:searchData="searchMonth" @search="searchHandle" clearable: flase />
      <EchartsWithObserve ref="chartRef" style="height: calc(100% - 55px)" :option="chartOption"></EchartsWithObserve>
      <el-tooltip content="点击日期查看详细数据" placement="right-end" effect="light">
        <!-- <el-button>Light</el-button> -->
        <img class="hand" src="@/assets/image/bill/hand.png" alt="" v-if="searchMonthDate.date.length > 0" />
      </el-tooltip>
    </ACard>

    <ACard class="container2">
      <ATable class="table-list" :tableConfig="tableConfig" :tableHead="tableHead" :tableData="tableData" :loading="tableLoading">
        <template #tokenAll="{ data }">
          <div>{{ data.tokenIn }}-{{ data.tokenOut }}</div>
        </template>
        <template #supplierName="{ data }">
          <div class="table-name">
            <div>{{ data.supplierName }}</div>
            <el-icon size="18" class="table-name-icon" @click="jumpRouter(data)"> <AIcon icon="icon-dianjichakan" /> </el-icon>
          </div>
        </template>
      </ATable>
    </ACard>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '/APIBilling',
});
import { ref, onUnmounted, onMounted, nextTick } from 'vue';

import { ACard } from '@/components/AAUI';
import { useBilling, useDetailListilList } from './hook/useBilling';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/store/modules/theme';
import { dayjs } from 'element-plus';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const router = useRouter();
const { tableHead, tableData, tableActionList, tableLoading, totalData, tableConfig, getTableDetailList } = useDetailListilList();
const { chartOption, searchList, getMonthData, searchMonthDate } = useBilling();

const chartRef = ref();
const timer = ref();
const searchData = ref({
  // pageNum: 1,
  // pageSize: useThemeStore().pageSize,
  userId: userId,
  date: dayjs().format('YYYY-MM-DD'),
});
const searchMonth = ref({
  userId: userId,
  queryMonth: dayjs().format('YYYYMM'),
});
//跳转使用指南
const jumpRouter = (data: any) => {
  router.push({ name: '/LargeModelsList', query: { supplierId: data.supplierId } });
};
const getTableList = async () => {
  getTableDetailList(searchData.value);
};
const searchHandle = () => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  getMonthData(searchMonth.value);
  //切换月份数据变成空
  tableData.value = [];
};

//定时器
const queryData = () => {
  timer.value = setInterval(() => {
    getMonthData(searchMonth.value);
    getTableList();
  }, 5000 * 60);
};

onMounted(() => {
  getMonthData(searchMonth.value);
  getTableList();
  queryData();
  if (chartRef.value) {
    nextTick(() => {
      const myCharts = chartRef.value.getInstance();
      myCharts.on('click', 'xAxis.category', function (params: any) {
        if (timer.value) {
          clearTimeout(timer.value);
        }
        searchData.value.date = params.value;
        getTableList();
      });
      myCharts.on('click', 'series', function (params: any) {
        if (timer.value) {
          clearTimeout(timer.value);
        }
        searchData.value.date = params.name;
        getTableList();
      });
    });
  }
});
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
});
</script>

<style lang="scss" scoped>
.select-d {
  :deep(.el-month-table td.today .cell) {
    // 月份
    font-weight: normal; // 字体加粗程度改成不加粗
    color: #606266; // 未选中状态的日期颜色
  }
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: none;

  .container1 {
    position: relative;
    flex: 1;
    border: none;
    box-shadow: 0px 0px 10px rgba(119, 99, 241, 0.15);

    .container-select {
      :deep(.el-input) {
        --el-input-focus-border-color: var(--el-border-color);
        --el-input-hover-border-color: var(--el-menu-active-bg-color);
      }
      :deep(.asterisk-left) {
        margin-top: 9px;
        margin-bottom: 10px;
      }
    }
    .hand {
      width: 25px;
      height: 25px;
      position: absolute;
      bottom: 35px;
      left: 10px;
    }
  }
  .container2 {
    margin-top: 10px;
    box-shadow: 0px 0px 10px rgba(119, 99, 241, 0.15);
    border: none;
  }
}
.table-list {
  color: #333;
  :deep(.el-table) {
    // --el-color-primary: var(--el-menu-active-bg-color);
    --el-table-row-hover-bg-color: var(--table-row-bg-hover);
    --el-table-current-row-bg-color: var(--table-row-bg-hover);
    --el-text-color-regular: #333333;

    --el-fill-color-lighter: var(--table-row-striped);
    // --el-table-current-row-bg-color
  }

  :deep(.el-table__footer-wrapper tbody td.el-table__cell) {
    background-color: #eceff6;
  }
  // :deep(.el-table .cell) {
  //   display: flex;
  //   justify-content: space-around;
  //   align-items: center;
  // }

  :deep(.el-pager li.is-active) {
    background-color: var(--el-menu-hover-bg-color);
  }
  :deep(.el-pager li:hover) {
    background-color: var(--el-menu-hover-bg-color);
  }

  :deep(.el-select .el-input__inner) {
    background-color: #fff;
  }

  .table-name {
    display: flex;
    justify-content: space-between;
    .table-name-icon {
      cursor: pointer;
      color: #bcbcbc;
    }
  }
}
</style>
