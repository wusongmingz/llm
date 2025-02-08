<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRefs, watch } from 'vue';

const prop = defineProps<{
  data: Record<string, any>[];
  column: { label: string; prop: string }[];
  option?: Record<string, any>;
}>();

const { data, column } = toRefs(prop);
onMounted(() => {
  const options = {
    container: 'luckysheet', //luckysheet为容器id
    lang: 'zh',
    showinfobar: false,
    enableAddRow: false,
    enableAddBackTop: false,
    row: data.value.length + 1 > 100 ? data.value.length + 1 : 100,
    data: [{ name: 'Sheet', index: 0, status: 1, order: 0, celldata: [] }],
    ...prop.option,
  };
  (window as any).luckysheet.create(options);
  updateData();
});
onUnmounted(() => {
  (window as any).luckysheet.destroy();
});

const sheet = computed(() => {
  return column.value.map((item) => item.prop);
});
const dealCellValue = computed(() => {
  const cellValue: any[][] = [];
  cellValue[0] = column.value.map((item) => item.label);
  data.value.forEach((item, index) => {
    cellValue[index + 1] = [];
    Object.keys(item).forEach((e) => {
      cellValue[index + 1][sheet.value.indexOf(e)] = item[e as keyof typeof item];
    });
  });
  return cellValue;
});
const updateData = () => {
  (window as any).luckysheet.setRangeValue(dealCellValue.value, {
    range: {
      row: [0, dealCellValue.value.length - 1],
      column: [0, dealCellValue.value[0].length - 1],
    },
  });
};

const getData = () => {
  const data: Record<string, any>[] = [];
  const cellData = (window as any).luckysheet.toJson().data[0].celldata;
  cellData.forEach((item: any) => {
    if (item.r === 0) return;
    if (!data[item.r - 1]) data[item.r - 1] = {};
    data[item.r - 1][sheet.value[item.c]] = item.v.v;
  });
  return data;
};
watch(dealCellValue, () => {
  updateData();
});
defineExpose({
  getData,
});
</script>

<template>
  <div id="luckysheet" style="width: 100%; height: 100%"></div>
</template>

<style scoped lang="scss"></style>
