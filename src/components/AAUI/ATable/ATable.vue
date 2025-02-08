<template>
  <div class="table-box" :class="autoHeight ? 'auto-height' : ''">
    <div v-if="tableConfig?.showFilter ?? false" style="text-align: right"><AListFilter v-model:list="tableHeadCopy" /></div>
    <div :style="autoHeight ? tableHeight : ''">
      <el-table
        v-loading="loading"
        ref="elTableRef"
        stripe
        highlightCurrentRow
        header-cell-class-name="table-header"
        :border="true"
        :height="autoHeight ? '100%' : undefined"
        :data="tableData"
        v-bind="{ ...tableConfig, ...$attrs }"
      >
        <!-- 多选列 -->
        <el-table-column v-if="tableConfig?.showSelection ?? false" align="center" type="selection" width="55" />
        <!-- 序号列 -->
        <el-table-column v-if="tableConfig?.showIndex ?? false" align="center" type="index" label="序号" width="55" />
        <!-- 表格内容 -->
        <template v-for="item in tableHeadCopy">
          <el-table-column :key="item.prop" v-if="!item.hideColumu" :show-overflow-tooltip="true" v-bind="{ ...columuConfig, ...item }">
            <template #header="scope">
              <slot :name="item.prop + 'Header'" :data="scope.column">{{ scope.column.label }}</slot>
            </template>
            <template v-if="item.childHead" #default>
              <el-table-column v-for="e in item.childHead" :key="e.prop" :show-overflow-tooltip="true" v-bind="{ ...columuConfig, ...e }">
                <template #default="scope">
                  <slot :name="e.prop" :data="scope.row" v-bind="scope">{{ scope.row[e.prop] }}</slot>
                </template>
                <template #header="scope">
                  <slot :name="e.prop + 'Header'" :data="scope.column">{{ scope.column.label }}</slot>
                </template>
              </el-table-column>
            </template>
            <template v-else #default="scope">
              <slot :name="item.prop" :data="scope.row" v-bind="scope">{{ scope.row[item.prop] }}</slot>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column :fixed="'right'" v-if="actionList.length" label="操作" :width="actionLength" align="center">
          <template #header="scope">
            <slot name="tableActionHeader" :data="scope.column">{{ scope.column.label }}</slot>
          </template>
          <template #default="scope">
            <template v-for="item in actionList" :key="item.prop">
              <el-tooltip :content="item.label" :disabled="!item.icon" effect="dark" placement="top">
                <el-button
                  size="small"
                  :class="item.icon ? 'icon-btn' : 'text-btn'"
                  :type="item.type"
                  @click="actionClick(item.prop, scope.row)"
                  v-bind="item.option"
                  :disabled="item.option?.customDisabled ? item.option.customDisabled(scope.row) : item.option?.disabled"
                >
                  <el-icon v-if="item.icon" :size="16"><AIcon :icon="item.icon" /></el-icon>
                  <span v-else>{{ item.label }}</span>
                </el-button>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <slot name="default"></slot>
        <template #empty>
          <slot name="empty"></slot>
        </template>
      </el-table>
    </div>
    <div class="pagination" v-if="prop.pageSize === undefined ? false : true">
      <APagination
        :total="total || tableData.length"
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        @pageChange="(e: IPageInfo) => emit('pageChange', e)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @prop {ITableConfig} tableConfig - 可选, table的配置项, 对象属性与 element plus 官网在 el-table 标签上的属性一致
 *      @typedef {object} ITableConfig
 *          @property {boolean} showIndex - 可选, 是否显示序号列，默认为 false
 *          @property {boolean} showSelection - 可选, 是否显示选择框列，默认为 false
 *          @property {boolean} showFilter - 可选, 是否显示筛选排序按钮，默认为 false
 *          @property 以及 element plus 官网在 el-table 标签上的属性
 * @prop {IColumuConfig} columuConfig - 可选, table-colume的配置项, 会设置到所有内容列, 对象属性与 element plus 官网在 el-table-colume 标签上的属性一致
 * @prop {ITableHead[]} tableHead - 必填, 表头的列表, 数组每一项包含每一列的表头和这一列的配置
 *      @typedef {object} ITableHead
 *          @property {string} label - 必填, 列标题
 *          @property {string} prop - 必填, 字段名称
 *          @property {boolean} hideColumu - 可选, 隐藏此列
 *          @property 以及 element plus 官网在 el-table-colume 标签上的属性
 * @prop {any[]} tableData - 表格显示的数据
 * @prop {ITableAction[]} actionList - 可选, 表格每一行末尾的操作按钮
 *      @typedef {object} ITableAction
 *          @property {string} label - 必填, 列标题
 *          @property {string} prop - 必填, 字段名称
 *          @property {string} type - 可选, 与 element plus 官网在 el-button 上的 type 属性一致
 *          @property {string} icon - 可选, 填写时显示图标, 目前仅适配icon-font, 填写其图标名
 *          @property {Partial<ButtonProps> & { customDisabled?: (row: any) => any }} option - 可选，支持 element plus 中按钮的所有属性和自定义禁用函数功能，函数入参为此行数据，自定义禁用优先级更高一些
 * @prop {boolean} loading - 可选, 是否显示loading
 * @prop {number} total - 可选, 分页组件总数
 * @prop {number} pageSize - 可选, 分页组件当前页大小
 * @prop {number} currentPage - 可选, 分页组件当前页
 * @prop {number} autoHeight - 可选, 自动适配表格高度
 *
 *
 * @event action - 用户点击表格每一行末尾按钮触发
 *      @property {object} payload - { method: string; data: any; }, method 为 actionList 中传入的 prop 字段, data 为此行数据
 * @event pageChange - 分页相关内容改变时触发
 *      @property {object} pageInfo - { pageSize: number; page: number; }
 * @event update:pageSize - 与父组件的当前页大小双向绑定
 * @event update:currentPage - 与父组件的当前页双向绑定
 * @event 支持el-table 支持 element plus 在 el-table 中所有事件，@fixme 但是使用时没有 ts 提示，目前不知道如何处理
 */
import { computed, ref, watchEffect } from 'vue';
import { TableInstance } from 'element-plus';
import { ITableConfig, IColumuConfig, ITableAction, ITableHead } from './types/table';
import { IPageInfo } from '../APagination/types/pagination';

const prop = withDefaults(
  defineProps<{
    tableConfig?: ITableConfig;
    columuConfig?: IColumuConfig;
    tableHead: ITableHead[];
    tableData: Array<any>;
    actionList?: ITableAction[];
    loading?: boolean;
    total?: number;
    pageSize?: number;
    currentPage?: number;
    autoHeight?: boolean;
  }>(),
  {
    actionList: () => [],
    columuConfig: () => ({}),
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'action', method: string, data: any): void;
  (e: 'pageChange', pageInfo: IPageInfo): void;
  (e: 'update:pageSize', value: number): void;
  (e: 'update:currentPage', value: number): void;
}>();

const tableHeadCopy = ref<ITableHead[]>([]);
watchEffect(() => {
  tableHeadCopy.value = [...prop.tableHead];
});

const actionList = computed(() => {
  return prop.actionList.filter((item) => !item.hidden);
});

const pageSize = computed({
  get: () => {
    return prop.pageSize || 10;
  },
  set: (val) => {
    emit('update:pageSize', val);
  },
});
const currentPage = computed({
  get: () => {
    return prop.currentPage || 1;
  },
  set: (val) => {
    emit('update:currentPage', val);
  },
});

const actionClick = (method: string, data: any) => {
  emit('action', method, data);
};

const actionLength = computed(() => {
  let length = 0;
  actionList.value.forEach((e) => {
    if (e.icon) {
      length += 26;
    } else {
      length += e.label.length * 12 + 24;
    }
  });
  length += actionList.value.length * 12 + 24;
  return length < 55 ? 55 : length;
});

const tableHeight = computed(() => {
  const showPage = prop.pageSize ? 1 : 0;
  const showFilter = prop.tableConfig?.showFilter ?? false ? 1 : 0;
  return `height: calc(100% - ${showPage * 52}px - ${showFilter * 30}px)`;
});

const elTableRef = ref<TableInstance>();
const getTableInstance = () => {
  return elTableRef.value;
};
defineExpose({ getTableInstance });
</script>

<style lang="scss" scoped>
.auto-height {
  height: 100%;
  overflow: auto;
}
.table-box {
  .el-table {
    --el-table-header-bg-color: var(--layout-main-bg-color);
    --el-table-header-text-color: var(--layout-main-text-color);
  }
  .pagination {
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
  .icon-btn {
    padding: 4px;
  }
}
</style>
