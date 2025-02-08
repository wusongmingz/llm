<template>
  <ADialog v-model:isShow="checkAdialog" :option="{ width: '70%' }" hideAction>
    <template #header>
      <div class="a_header">
        <div style="display: flex; align-items: center">
          API-Key&nbsp;<span>使用日志</span>
          <el-icon size="23" style="cursor: pointer" @click="getTableList"> <AIcon icon="icon-shuaxin" /> </el-icon>
          <span style="padding-left: 60px; font-weight: bold">{{ apikeyName }}</span>
        </div>
        <div style="margin-right: 50px">
          <span style="font-size: 13px">日期范围</span>
          <el-date-picker
            v-model="timePick"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            value-format="YYYYMMDD"
            v-bind="{ ...dateSelectDisabled }"
            @change="changeDate(searchData)"
          >
            <template #range-separator>
              <span style="font-size: 13px">至</span>
            </template>
          </el-date-picker>
        </div>
      </div>
    </template>
    <!-- <ATable
      class="table-list"
      :tableConfig="tableConfig"
      :tableHead="tableHead"
      :tableData="tableData"
      :loading="tableLoading"
      :height="500"
      :total="totalData"
      v-model:pageSize="searchData.pageSize"
      v-model:currentPage="searchData.pageNum"
      @pageChange="getTableList"
    >
      <template #supplierName="{ data }">
        <div class="table-name">
          <div>{{ data.supplierName }}</div>
          <el-icon size="18" class="table-name-icon" @click="jumpRouter"> <AIcon icon="icon-dianjichakan" /> </el-icon>
        </div>
      </template>
    </ATable> -->
    <ATable class="table-list" :tableConfig="tableConfig" :tableHead="tableHead" :tableData="tableData" :loading="tableLoading" :height="500">
      <template #supplierName="{ data }">
        <div class="table-name">
          <div>{{ data.supplierName }}</div>
          <el-icon size="18" class="table-name-icon" @click="jumpRouter(data)"> <AIcon icon="icon-dianjichakan" /> </el-icon>
        </div>
      </template>
    </ATable>
  </ADialog>
</template>

<script setup lang="ts">
// import CircleCloseFilled from 'element-plus';
// const prop = defineProps<{
//   isShowDialog: boolean;
//   type: string;
// }>();
import { useDateSelectDisabled } from '@/hook/useTimeTools';
import { ref, watch } from 'vue';
import { useDetailListilList } from './hook/useDetailList';
import { useThemeStore } from '@/store/modules/theme';
import { useRouter } from 'vue-router';
//限制只能选择7天
const dateSelectDisabled = useDateSelectDisabled(7);
const router = useRouter();
const props = defineProps(['apiKey']);
const apikeyName = ref('');
const formatDate = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
const currentDate = new Date();
const searchData = ref({
  pageNum: 1,
  beginDate: formatDate(currentDate),
  endDate: formatDate(currentDate),
  pageSize: useThemeStore().pageSize,
  apiKey: props.apiKey,
});
const checkAdialog = ref<boolean>(false);
const { tableHead, tableData, tableActionList, tableLoading, totalData, tableConfig, getTableDetailList, timePick, changeDate } =
  useDetailListilList();
defineExpose({
  checkAdialog,
  apikeyName,
});
const getTableList = async () => {
  searchData.value.apiKey = props.apiKey;
  getTableDetailList(searchData.value);
};
watch(checkAdialog, (value) => {
  if (value) {
    searchData.value.beginDate = formatDate(new Date());
    searchData.value.endDate = formatDate(new Date());
    getTableList(); //传入的userId todo
  }
});
//跳转使用指南
const jumpRouter = (data: any) => {
  router.push({ name: '/LargeModelsList', query: { supplierId: data.supplierId } });
};
</script>

<style lang="scss" scoped>
.a_header {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-weight: normal;
    margin-right: 10px;
  }
  :deep(.el-date-editor) {
    --el-input-hover-border-color: var(--el-menu-active-bg-color);
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
