<template>
  <div class="card" id="render" v-click-outside="handleClose1">
    <div class="card-top">
      <div class="card-top-1">
        <el-select clearable v-model="isOpen" placeholder="模型开闭源" style="width: 120px" @change="getFilterModel">
          <!-- <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" /> -->
          <el-option label="模型开源" value="1" />
          <el-option label="模型闭源" value="0" />
        </el-select>
        &nbsp;&nbsp;&nbsp;
        <el-select clearable v-model="superplay" placeholder="供应商" style="width: 120px" @change="getFilterModel">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        &nbsp;&nbsp;&nbsp;
        <el-select clearable v-model="contextLength" placeholder="上下文长度" style="width: 120px" @change="getFilterModel">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <el-button class="clear-btn" @click="clearIconList"> 全部清除 </el-button>
      <div class="card-top-2">
        <el-icon size="20" style="color: #aaa; cursor: pointer" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </div>
    <div class="card-body" v-loading="loadFlag">
      <div class="card-body-1" v-for="(itemGrop, index) in listData" :key="index">
        <span class="card-body-1-1" v-for="(item, index1) in itemGrop" :key="index1">
          <el-checkbox :disabled="item.disabled || item.tempDisabled" v-model="item.flag" size="large" @change="changeFlag(item)" />
          &nbsp;<span
            :style="{ cursor: item.disabled || item.tempDisabled ? 'not-allowed' : 'pointer' }"
            :class="{ 'chebox-text': item.flag }"
            @click="changeFlag1Box(item)"
            >{{ item.name }}</span
          >
        </span>
      </div>
    </div>
    <!-- <div class="card-footer">
      <div class="card-footer-1" @click="handleClose">确认</div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { ClickOutside as vClickOutside } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import { userSelect } from './hook/userSelect';
import { onMounted, watch, onBeforeUnmount } from 'vue';
const $emit = defineEmits(['handleShowModelSelect']);
const handleClose = () => {
  $emit('handleShowModelSelect', false);
};
const handleClose1 = (e: any) => {
  if (e?.target?.localName == 'span' || e?.target?.localName == 'li') {
    return;
  }
  if (e) $emit('handleShowModelSelect', false);
};

const { iconList, loadFlag, superplay, options1, isOpen, contextLength, options2, init, listData, getFilterModel, changeFlag, changeFlag1Box } =
  userSelect();
const handleScroll = () => {
  // console.log('滚动事件触发');
};
const clearIconList = () => {
  // console.log(listData.value);
  for (const x of Object.keys(listData.value)) {
    listData.value[x].map((item: any) => {
      item.flag = false;
      item.tempDisabled = false;
    });
  }
  iconList.value = [];
};
watch(loadFlag, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});
onMounted(() => {
  init();
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
<style lang="scss" scoped>
.card {
  border: 1px solid #aaa;
  border-radius: 10px;
  margin-left: 118px;
  margin-top: 60px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .card-top {
    height: 44px;
    border-bottom: 1px solid #aaa;
    display: flex;
    align-items: center;
    .card-top-1 {
      width: 90%;
      display: flex;
      justify-content: center;
      margin-left: 5%;
    }
    .card-top-2 {
      width: 10%;
      display: flex;
      justify-content: center;
    }
    :deep(.el-select) {
      --el-select-input-focus-border-color: #d7d7d7;
      --el-select-border-color-hover: var(--el-menu-active-bg-color);
    }
  }
  .card-body {
    flex: 1;
    overflow: auto;
    padding: 0 5px;
    .card-body-1 {
      border-bottom: 1px solid #d7d7d7;
      display: flex;
      flex-wrap: wrap;
      .card-body-1-1 {
        margin: 10px 0px;
        width: 24%;
        min-height: 40px;
        margin: 5px 0.5%;
        border-radius: 10px;
        background-color: rgba(237, 241, 244, 1);
        font-size: 13px;
        color: #333;
        padding: 5px;
        display: flex;
        // justify-content: center;
        align-items: center;
        .chebox-text {
          color: var(--el-menu-active-bg-color);
        }
      }
    }
  }
  .card-footer {
    border-top: 1px solid #aaa;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .card-footer-1 {
      cursor: pointer;
      margin-right: 20px;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      background-color: var(--el-menu-active-bg-color);
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.clear-btn {
  height: 32px;
  font-size: 13px;

  &:hover {
    color: #000;
    background: #cbcdfe;
  }
}
</style>
