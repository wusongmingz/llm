<template>
  <el-pagination
    layout="total, prev, pager, next,sizes,jumper"
    :total="total"
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :page-sizes="[10, 20, 50, 100, 200]"
    @sizeChange="changeHandle"
    @currentChange="changeHandle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IPageInfo } from './types/pagination';
const prop = defineProps<{
  total: number;
  pageSize: number;
  currentPage: number;
}>();
const emit = defineEmits<{
  (e: 'pageChange', pageInfo: IPageInfo): void;
  (e: 'update:pageSize', value: number): void;
  (e: 'update:currentPage', value: number): void;
}>();
const pageSize = computed({
  get: () => {
    return prop.pageSize;
  },
  set: (val) => {
    emit('update:pageSize', val);
  },
});
const currentPage = computed({
  get: () => {
    return prop.currentPage;
  },
  set: (val) => {
    emit('update:currentPage', val);
  },
});

const changeHandle = () => {
  emit('pageChange', {
    pageSize: prop.pageSize,
    page: prop.currentPage,
  });
};
</script>
