<template>
  <el-dialog class="a-dialog" v-model="isShow" :closeOnClickModal="false" v-bind="option">
    <template #header>
      <slot name="header">
        <div>{{ prop.title }}</div>
      </slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer v-if="!hideAction">
      <slot name="footer">
        <div style="flex: auto">
          <el-button @click="cancelHandle">取 消</el-button>
          <el-button type="primary" @click="submitHandle">确 认</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * @prop {string} title - 可选, 标题
 * @prop {boolean} isShow - 必填, 控制抽屉显示与隐藏, 与父组件双向绑定
 * @prop {boolean} option - 可选, element plus 官网在 el-dialog 标签上的属性
 *
 * @event cancel - 点击取消按钮时触发
 * @event submit - 点击确定按钮时触发
 * @event update:isShow - 与父组件双向绑定, 控制抽屉显示与隐藏
 */
import { DialogProps } from 'element-plus';
import { computed } from 'vue';
const prop = defineProps<{
  isShow: boolean;
  title?: string;
  option?: Partial<DialogProps>;
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
<style lang="scss">
.a-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  border-radius: 10px !important;
  .el-dialog__header {
    // background-color: var(--layout-dialog-header-color);
    margin-right: 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #d7d7d7;
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }
  .el-dialog__body {
    // padding: var(--el-dialog-padding-primary);
    padding: 20px 20px 10px 20px;
    flex: 1;
    overflow: auto;
  }
}
</style>
