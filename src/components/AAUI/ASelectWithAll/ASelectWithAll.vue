<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { CheckboxValueType } from 'element-plus';
const props = defineProps<{
  value?: unknown[];
  selectOption?: {
    label?: string;
    value?: string;
    options: Array<any>;
  };
}>();
const emits = defineEmits<{
  (event: 'update:value', value: unknown[] | undefined): void;
  (event: 'change', value: any): void;
}>();
const isChecked = ref(false);
const selectChange = (value: any) => {
  emits('change', value);
};
const selectAll = (value: CheckboxValueType) => {
  if (value) valueComp.value = (props.selectOption?.options || []).map((item) => item[props.selectOption?.value || 'value']);
  else valueComp.value = [];
  emits('change', valueComp.value);
};
watch(
  [() => props.value, () => props.selectOption?.options],
  (val) => {
    if (val[0]?.length === (props.selectOption?.options || []).length) {
      isChecked.value = true;
    } else {
      isChecked.value = false;
    }
  },
  { immediate: true },
);
const valueComp = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emits('update:value', val);
  },
});
</script>

<template>
  <el-select class="select-with-all" @change="selectChange" v-model="valueComp" multiple>
    <template #prefix>
      <el-checkbox v-model="isChecked" @change="selectAll"></el-checkbox>
    </template>
    <el-option
      v-for="e in selectOption?.options || []"
      :key="e[selectOption?.value || 'value']"
      :label="e[selectOption?.label || 'label']"
      :value="e[selectOption?.value || 'value']"
    />
  </el-select>
</template>

<style scoped lang="scss">
.select-with-all:deep(.el-select__tags) {
  margin-left: 30px;
}
</style>
