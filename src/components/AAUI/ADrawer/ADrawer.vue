<template>
  <el-drawer v-model="isShow" direction="rtl" :size="500" v-bind="option">
    <template #header>
      <div>{{ prop.title }}</div>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer v-if="!hideAction">
      <div style="flex: auto">
        <el-button @click="cancelHandle">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
/**
 * @prop {string} title - 必填, 标题
 * @prop {boolean} isShow - 必填, 控制抽屉显示与隐藏, 与父组件双向绑定
 * @prop {boolean} option - 可选, element plus 官网在 el-drawer 标签上的属性
 *
 * @event cancel - 点击取消按钮时触发
 * @event submit - 点击确定按钮时触发
 * @event update:isShow - 与父组件双向绑定, 控制抽屉显示与隐藏
 */
import { DrawerProps } from 'element-plus';
import { computed } from 'vue';
const prop = defineProps<{
  isShow: boolean;
  title: string;
  option?: Partial<DrawerProps>;
  hideAction?: boolean;
}>();
const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'submit'): void;
  (event: 'update:isShow', value: boolean): void;
}>();
const isShow = computed({
  get: () => {
    return prop.isShow;
  },
  set: (val) => {
    emit('update:isShow', val);
  },
});
const cancelHandle = () => {
  isShow.value = false;
  emit('cancel');
};
const submitHandle = () => {
  emit('submit');
};
</script>
