<template>
  <div class="box">
    <div class="box-top">
      <el-icon size="25" class="icon-color"> <AIcon icon="icon-gengduo" /> </el-icon>&nbsp;
      <div>更多模型</div>
    </div>
    <div class="box-center">
      <div class="box-item" v-for="(item, index) in list" :key="index" @click="changeModel(item)">
        <img v-if="item.iconUrl" :src="item.iconUrl" />
        <div v-show="!item.iconUrl" style="width: 40px; margin-left: 20px"></div>
        &nbsp; {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const emit = defineEmits(['refresh']);
const props = defineProps(['suppers']);
const list = computed(() => {
  return props.suppers;
});
// const icon = computed(() => {
//   return props.suppers?.icon;
// });
const changeModel = (item: any) => {
  emit('refresh', item);
};
</script>
<style lang="scss" scoped>
.box {
  .box-top {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    .icon-color {
      color: var(--el-menu-active-bg-color);
    }
  }
  .box-center {
    width: 100%;
    overflow: auto;
    .box-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0px;
      border-radius: 10px;
      background-color: #eeefff;
      &:hover {
        box-shadow: 0px 3px rgba(0, 0, 0, 0.15);
      }
      img {
        margin-left: 20px;
        width: 40px;
        height: 40px;
      }
      img[src=''],
      img:not([src]) {
        opacity: 0;
      }
      height: 60px;
    }
  }
}
</style>
