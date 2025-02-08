<script setup lang="ts">
import { MCard } from 'monose-component-vue';
import { toRefs } from 'vue';
const prop = withDefaults(
  defineProps<{
    withCard?: boolean;
  }>(),
  {
    withCard: true,
  },
);
const { withCard } = toRefs(prop);
</script>

<template>
  <MCard v-if="withCard">
    <div class="no-data-box">
      <img width="200" src="../../assets/image/public/no-data.png" />
      <div>暂无数据</div>
    </div>
  </MCard>
  <div v-else class="no-data-box">
    <img width="200" src="../../assets/image/public/no-data.png" />
    <div>暂无数据</div>
  </div>
</template>

<style scoped lang="scss">
.no-data-box {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #dae1ed;
  font-size: 30px;
}
</style>
