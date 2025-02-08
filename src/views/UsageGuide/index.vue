<template>
  <ACard class="card-body">
    <div class="card-box">
      <div class="card-text">
        <IFrame :url="docUrl" />
      </div>
    </div>
  </ACard>
</template>

<script setup lang="ts">
defineOptions({
  name: '/UsageGuide',
});
import IFrame from '@/layout/IFrame/IFrame.vue';
import { userGuide } from '@/api/UsageGuide/guide';
import { ref, reactive, onMounted, nextTick } from 'vue';
const docUrl = ref('');
userGuide().then((res) => {
  if (res.code === 0) {
    docUrl.value = res.data;
  }
});
</script>

<style lang="scss" scoped>
.card-body {
  height: 100%;
  .card-box {
    height: 100%;
    overflow: hidden;
    border: 0px;
    .card-text {
      // width: calc(100% + 90px);
      // height: calc(100% + 90px);
      height: 100%;
      margin: -10px 0px 0px -0px;
    }
  }
}
</style>
