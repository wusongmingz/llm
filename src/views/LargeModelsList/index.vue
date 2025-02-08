<template>
  <ModelSearch v-show="showFlag === 0" @changeShowFlag="changeShowFlag"></ModelSearch>
  <ModelDetail v-if="showFlag === 1" @changeShowFlag="changeShowFlag"></ModelDetail>
  <LLMDetail v-if="showFlag === 2" @changeShowFlag="changeShowFlag"></LLMDetail>
</template>
<script setup lang="ts">
defineOptions({
  name: '/LargeModelsList',
});
import ModelSearch from './ModelSearch/index.vue';
import ModelDetail from './ModelDetail/index.vue';
import LLMDetail from './LLMDetail/index.vue';
import { useRoute } from 'vue-router';
import { ref, h, onMounted, onUpdated, watchEffect, provide } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
import { getSupplierInfo } from '@/api/LargeModelsList/modelSearch';
const showFlag = ref(0);
const modelDetailAll = ref<any>({});
const supDetailAll = ref<any>({});
const ModelDetailRef = ref();
provide('modelDetailAll', modelDetailAll);
provide('supDetailAll', supDetailAll);
const changeShowFlag = (index: number) => {
  showFlag.value = index;
};
//请求大模型厂商
const getSup = async (data: any) => {
  const res = await getSupplierInfo(data);
  if (res.code === 0) {
    if (res.data) {
      supDetailAll.value = res.data;
    }
  } else {
    ElMessage.error(res.msg || '网络错误');
  }
};
onMounted(() => {
  const route = useRoute();
  if (route.query.supplierId) {
    showFlag.value = 2;
    getSup({ supplierId: route.query.supplierId });
  } else {
    //
  }
});
</script>
<style lang="scss" scoped></style>
