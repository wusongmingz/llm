<template>
  <div>
    <div class="tltle">明细</div>
    <div class="context-text">软通在按价格加权的提供商之间<span>对请求进行负载均衡</span>，除非您使用<span>动态路由</span>。</div>
    <div>
      <div class="box-detail">
        <div v-for="(item, index) in tableHead" :key="index" class="box-detail-text1" :class="{ 'box-detail-text1': item.label == '模型训推位宽' }">
          <div class="box-detail-text">{{ item.label }}</div>
          <div class="box-detail-prop">
            <div :class="{ 'box-detail-prop1': item.label == '模型训推位宽' }">
              {{ tableData[item.prop] }}
              <span v-if="item.prop === 'maxTokens'">K</span>
            </div>
            <div v-if="item.label == 'APIKey'" class="table-name">
              <img @click="intoChat()" class="table-name-icon" src="@/assets/image/modelList/denglumima.png" alt="" title="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useModelDetails } from './hook/useModelDetails';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const modelDetailAll = <any>inject('modelDetailAll');
const { inPriceUnit, outPriceUnit, tableHead, tableData, tableLoading, tableConfig } = useModelDetails();
const intoChat = () => {
  router.push({ name: '/APIManagement' });
};
onMounted(() => {
  inPriceUnit.value = modelDetailAll.value.inPriceUnit;
  outPriceUnit.value = modelDetailAll.value.outPriceUnit;
  tableData.value = modelDetailAll.value;
  // if (tableData.value.moreTraining) {
  //   tableData.value.isTrain = '是';
  // } else {
  //   tableData.value.isTrain = '否';
  // }
  if (tableData.value.output) {
    tableData.value.isStream = '是';
  } else {
    tableData.value.isStream = '否';
  }
});
</script>
<style lang="scss" scoped>
.tltle {
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  border-bottom: 1px solid #7f7f7f;
  .icon-color {
    cursor: pointer;
    color: #7f7f7f;
  }
}
.context-text {
  font-size: 13px;
  margin: 20px 0px;
  color: #333;
  // span {
  //   color: var(--el-menu-active-bg-color);
  // }
}
.table-name {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .table-name-icon {
    width: 25px;
    height: 25px;
    color: #aaa;
    margin: 0 5px;
    cursor: pointer;
  }
  .table-name-icon1 {
    width: 25px;
    height: 25px;
    color: #aaa;
    margin: 0 5px;
    // cursor: pointer;
  }
}
.box-detail {
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  color: #333;
  align-items: flex-start;
  .box-detail-text1 {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .box-detail-text {
    white-space: nowrap;
    border-bottom: 1px solid #aaa;
    min-width: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 35px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .box-detail-prop {
    // border: 1px solid salmon;
    display: flex;
    .box-detail-prop1 {
      min-width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      &:hover {
        background-color: var(--el-menu-hover-bg-color);
      }

      // padding: 2px;
    }
  }
}
</style>
