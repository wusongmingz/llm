<template>
  <el-popover :popper-style="{ paddingRight: 0 }" placement="bottom-end" :width="230" trigger="click">
    <template #reference>
      <span>
        <el-tooltip :append-to="body" effect="dark" content="列设置" placement="top">
          <el-icon :size="20" class="setting-icon"><Setting /></el-icon>
        </el-tooltip>
      </span>
    </template>
    <el-checkbox-group class="filter-checkbox" id="items" v-model="checkList" @change="checkHandle">
      <div v-for="item in list" :key="item.prop" :data-id="item.prop" style="white-space: nowrap">
        <el-icon :size="15" style="margin-right: 10px" class="sort-handle"><Rank /></el-icon>
        <el-checkbox :label="item.label" checked />
      </div>
    </el-checkbox-group>
  </el-popover>
</template>

<script setup lang="ts">
import { Setting, Rank } from '@element-plus/icons-vue';
import Sortable from 'sortablejs';
import { computed, onMounted, ref } from 'vue';
import { ITableHead } from '../ATable/types/table';
import { CheckboxValueType } from 'element-plus';

const props = defineProps<{
  list: ITableHead[];
}>();
const emits = defineEmits<{
  (e: 'update:list', value: ITableHead[]): void;
}>();

const body: any = document.getElementById('app');

const list = computed({
  get: () => {
    return props.list;
  },
  set: (val) => {
    emits('update:list', val);
  },
});

const checkList = ref<string[]>([]);
const checkHandle = (checked: CheckboxValueType[]) => {
  list.value = list.value.map((item) => {
    if (checked.includes(item.label)) {
      return { ...item, hideColumu: false };
    } else {
      return { ...item, hideColumu: true };
    }
  });
};

onMounted(() => {
  sortInit();
});
let sortableIns: Sortable;
const sortInit = () => {
  const el = document.getElementById('items');
  if (el) {
    sortableIns = new Sortable(el, {
      animation: 500,
      delay: 400,
      delayOnTouchOnly: true,
      dataIdAttr: 'data-id',
      handle: '.sort-handle',
      onSort: function () {
        list.value = list.value.sort(function (a, b) {
          const indexA = sortableIns.toArray().indexOf(a.prop);
          const indexB = sortableIns.toArray().indexOf(b.prop);
          return indexA - indexB;
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped>
.setting-icon {
  margin: 0 10px 10px;
  cursor: pointer;
}
.filter-checkbox {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0;
  :deep(.el-checkbox__label) {
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
