<template>
  <el-form inline ref="searchForm" :model="searchComputed" class="head-form" :rules="prop.rules" v-bind="config">
    <el-form-item v-for="item in searchList" :key="item.prop" :label="item.label" :prop="item.prop" :class="item.formItemClass">
      <el-input
        v-if="item.type === 'input'"
        style="width: 200px"
        v-model="searchComputed[item.prop]"
        :placeholder="'请输入' + item.label"
        @input="searchByFormWithDebounce"
        v-bind="item.option"
      />
      <div v-else-if="item.type === 'text'">{{ searchComputed[item.prop] }}</div>
      <el-select
        v-else-if="item.type === 'select'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        @change="searchByForm"
        v-bind="item.option"
      >
        <el-option
          v-for="e in item?.selectOption?.options || []"
          :key="e[item?.selectOption?.value || 'value']"
          :label="e[item?.selectOption?.label || 'label']"
          :value="e[item?.selectOption?.value || 'value']"
        />
      </el-select>
      <ASelectWithAll
        v-else-if="item.type === 'selectWithAll'"
        v-model:value="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        :selectOption="item.selectOption"
        @change="searchByForm"
        v-bind="item.option"
      />
      <el-radio-group v-else-if="item.type === 'radioGroup'" v-model="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option">
        <template v-if="item?.option?.type === 'button'">
          <el-radio-button
            v-for="e in item?.selectOption?.options || []"
            :key="e[item?.selectOption?.value || 'value']"
            :label="e[item?.selectOption?.value || 'value']"
            >{{ e[item?.selectOption?.label || 'label'] }}</el-radio-button
          >
        </template>
        <template v-else>
          <el-radio
            v-for="e in item?.selectOption?.options || []"
            :key="e[item?.selectOption?.value || 'value']"
            :label="e[item?.selectOption?.value || 'value']"
            >{{ e[item?.selectOption?.label || 'label'] }}</el-radio
          >
        </template>
      </el-radio-group>
      <el-date-picker
        v-else-if="item.type === 'datePicker'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="searchByForm"
        v-bind="item.option"
      />
      <el-time-picker
        v-else-if="item.type === 'timePicker'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="searchByForm"
        v-bind="item.option"
      />
      <el-time-select
        v-else-if="item.type === 'timeSelect'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        @change="searchByForm"
        v-bind="item.option"
      />
      <el-switch v-else-if="item.type === 'switch'" v-model="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option" />
      <el-rate v-else-if="item.type === 'rate'" v-model="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option" />
      <el-input-number v-else-if="item.type === 'number'" v-model="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option" />
      <el-cascader
        v-else-if="item.type === 'cascader'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        @change="searchByForm"
        v-bind="item.option"
      />
      <el-slider v-else-if="item.type === 'slider'" v-model="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option" />
      <el-upload v-else-if="item.type === 'upload'" v-model:file-list="searchComputed[item.prop]" @change="searchByForm" v-bind="item.option">
        <el-button type="primary">选择文件</el-button>
      </el-upload>
      <el-tree-select
        v-else-if="item.type === 'treeSelect'"
        v-model="searchComputed[item.prop]"
        :placeholder="'请选择' + item.label"
        @change="searchByForm"
        v-bind="item.option"
      />
      <slot v-else :name="item.prop" :data="searchComputed"></slot>
    </el-form-item>

    <el-form-item v-if="searchList.length !== 0">
      <el-button @click="search" type="primary" v-if="prop.showSearchButton">查 询</el-button>
      <el-button @click="reset" v-if="prop.showResetButton">重 置</el-button>
    </el-form-item>

    <div class="action">
      <div class="action-item" v-for="item in actionList.filter((item) => !item.hidden)" :key="item.prop" :prop="item.prop">
        <el-dropdown v-if="item.type === 'dropdown'" placement="bottom" @command="actionClick">
          <el-button v-bind="item.option">
            {{ item.label }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="e in item.dropList"
                :key="e.prop"
                :command="e.prop"
                :icon="e.icon"
                :disabled="e.disabled"
                :divided="e.divided"
                >{{ e.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-else-if="item.type === 'button'" @click="actionClick(item.prop)" v-bind="item.option">{{ item.label }}</el-button>
        <el-upload
          v-else-if="item.type === 'upload'"
          :show-file-list="false"
          :autoUpload="false"
          @change="actionClick(item.prop, $event)"
          v-bind="item.uploadOption"
        >
          <el-button v-bind="item.option">{{ item.label }}</el-button>
        </el-upload>
        <slot v-else :name="item.prop"></slot>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
/**
 * @prop {ISearchForm[]} searchList - 可选, table-colume的配置项, 会设置到所有内容列, 对象属性与 element plus 官网在 el-table-colume 标签上的属性一致
 *    @typedef {object} ISearchForm
 *          @property {string} label - 必填, 表单名称
 *          @property {string} prop - 必填, 字段名称
 *          @property {'select' | 'switch' | 'input' | 'number' | 'cascader' | 'treeSelect' | 'datePicker' | 'timePicker' | 'timeSelect' | 'radioGroup' | 'rate' | 'slider' | 'upload' | 'slot'} type - 表单种类
 *          @property {any} option - 可选, element plus 官网在 对应类型表单 标签上的属性
 *          @property {object} selectOption - 可选, { options: Array<any>; label?: string; value?: string; } options: 选择框列表, label: 自定义options中显示字段  value: 自定义options中绑定值字段
 * @prop {ISearchAction[]} actionList - 可选, table的配置项, 对象属性与 element plus 官网在 el-table 标签上的属性一致
 *    @typedef {object} ISearchAction
 *          @property {string} label - 必填, 按钮文字
 *          @property {string} prop - 必填, 字段名称, 对应 action 事件的参数
 *          @property {'button' | 'dropdown'} type - 必填, 按钮或具有下拉功能的按钮
 *          @property {Partial<ButtonProps>} option - 可选, element plus 官网在 el-button 标签上的属性
 *          @property {object} dropList - type 为 dropdown 时必填,  {prop: string; label: string; icon?: string | Component; disabled?: boolean; divided?: boolean;}
 * @prop {FormRules} rules - 可选, element plus 规定的表单校验类型一致
 * @prop {ISearchConfig} config - 可选, 支持 element plus 在 Form 上的属性
 * @prop {bool} showSearchButton - 可选, 是否显示查询按钮，如果不显示查询按钮，那么数据改变时直接触发查询操作
 * @prop {bool} showResetButton - 可选, 是否显示重置按钮
 * @prop {any} searchData - 必填, 与父组件双向绑定
 *
 * @event search - 点击查询按钮时触发
 * @event action - 点击 actionList 中的按钮触发
 *      @property {string} action - 对应 actionList 中的 prop 字段
 * @event update:searchData - 与父组件双向绑定
 */
import { ref, toRef, nextTick } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { ISearchAction, ISearchForm, ISearchConfig } from './types/searchForm';
import { FormRules } from 'element-plus';
import { debounce } from 'lodash-es';
import ASelectWithAll from '../ASelectWithAll/ASelectWithAll.vue';
const prop = withDefaults(
  defineProps<{
    actionList?: ISearchAction[];
    searchList?: ISearchForm[];
    searchData?: any;
    config?: ISearchConfig;
    rules?: FormRules;
    showSearchButton?: boolean;
    showResetButton?: boolean;
  }>(),
  {
    actionList: () => [],
    searchList: () => [],
    searchData: () => ({}),
    rules: () => ({}),
    showSearchButton: false,
    showResetButton: false,
  },
);

const emit = defineEmits<{
  (event: 'action', action: string, params: any[]): void;
  (event: 'search', data: any): void;
  (event: 'update:searchData', value: any): void;
}>();

const searchForm = ref();
const searchComputed = toRef(prop, 'searchData');

function validate(callback: (valid: boolean) => void) {
  return searchForm.value?.validate(callback);
}
function resetFields() {
  searchForm.value?.resetFields();
}
function clearValidate() {
  searchForm.value?.clearValidate();
}
defineExpose({
  resetFields,
  validate,
  clearValidate,
});

const actionClick = (method: string, ...args: any[]) => {
  emit('action', method, args);
};

const reset = () => {
  searchForm.value && searchForm.value?.resetFields();
  search();
};

const search = () => {
  emit('search', searchComputed.value);
};
const searchByForm = () => {
  nextTick(() => {
    !prop.showSearchButton && search();
  });
};
const searchByFormWithDebounce = () => {
  nextTick(() => {
    !prop.showSearchButton && searchDebounce();
  });
};
const searchDebounce = debounce(() => {
  search();
}, 300);
</script>

<style scoped>
.head-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.action {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.action-item {
  margin-right: 10px;
  margin-bottom: 18px;
}
.action :last-child {
  margin-right: 0;
}
</style>
