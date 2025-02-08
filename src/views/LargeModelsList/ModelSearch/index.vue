<template>
  <div class="box">
    <div class="box-1" v-loading="conditionFlag">
      <div class="box-start" style="flex: 6; align-items: flex-start; padding-top: 12px; min-height: 62px">
        <div class="box-text" style="height: 40px; line-height: 40px">文本长度</div>
        <el-slider class="box-slider" :step="10" v-model="textLen" show-stops :marks="marks" :min="10" :max="80" :show-tooltip="false"> </el-slider>
      </div>
      <div class="box-start" style="flex: 7.5">
        <span class="box-text">提示词价格</span>
        <el-input oninput="value=value.replace(/[^0-9.]/g,'')" v-model="minPrice" style="width: 100px" placeholder="自定最低价" />
        &nbsp;&nbsp;-&nbsp;&nbsp;
        <el-input oninput="value=value.replace(/[^0-9.]/g,'')" v-model="maxPrice" style="width: 100px" placeholder="自定最高价" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div class="box-btn1" @click="clearPrice">清除</div>
      </div>
      <div class="box-center" style="flex: 31.5">
        <span class="box-text" style="margin-top: 4.8px">模型能力</span>
        <div class="box-small">热门任务</div>
        <div class="box-block">
          <div
            class="box-btn2"
            :class="{ isActive: hotAbility.isActive }"
            @click="addConditionList(3, hotAbility)"
            v-for="(hotAbility, index) in hotAbilityList"
            :key="index"
          >
            {{ hotAbility.chName }}
          </div>
        </div>
        <div class="box-small">自然语言处理</div>
        <div class="box-block">
          <div
            class="box-btn2"
            :class="{ isActive: textAbility.isActive }"
            @click="addConditionList(3, textAbility)"
            v-for="(textAbility, index) in textAbilityList"
            :key="index"
          >
            {{ textAbility.chName }}
          </div>
        </div>
      </div>
      <div class="box-center" style="flex: 35">
        <span class="box-text">模型系列</span>
        <div class="box-block" style="display: grid; grid-template-columns: repeat(3, 1fr)">
          <div
            class="box-btn box-boder-btn"
            style="padding-left: 16px; height: 70px; justify-content: space-between"
            :class="{ isSelectModelActive: supplier.isActive }"
            @click="addConditionList(4, supplier)"
            v-for="(supplier, index) in supplierList"
            :key="index"
          >
            <div class="box-model">
              <img height="100%" :src="supplier.icon" alt="" />

              <div v-show="!supplier.icon" style="min-width: 30px"></div>
              &nbsp;&nbsp;
              <div style="max-width: 115px; white-space: normal">{{ supplier.series }}</div>
            </div>
            <div class="box-model-name">发布{{ supplier.num }}个模型</div>
          </div>
        </div>
      </div>
      <div class="box-center" style="flex: 16; margin: 0px">
        <span class="box-text">模型类别</span>
        <div class="box-block">
          <div class="box-btn5" :class="{ isActive: tag.isActive }" @click="addConditionList(5, tag)" v-for="(tag, index) in tagList" :key="index">
            {{ tag.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="box-2">
      <div class="search">
        <el-input
          style="width: 500px; height: 38px"
          maxlength="950"
          size="large"
          clearable
          :prefix-icon="() => h(ElIcon, { color: '#7763f1', size: 25 }, { default: () => h(AIcon, { icon: 'icon-sousuo' }) })"
          v-model="inputFilter"
        >
        </el-input>
        &nbsp;&nbsp;&nbsp;
        <el-select v-model="searchType" placeholder="Select" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="box-list" v-loading="conditionListFlag">
        <div class="box-item-top">
          <div class="item-top">
            共找到&nbsp;<span class="item-top-text">{{ filterModelList.length }}</span
            >&nbsp;个结果
            <div class="item-btn-box">
              <div class="item-top-btn" @click="delConditionList(index, condition)" v-for="(condition, index) in conditionList" :key="index">
                <div class="item-top-btn-text">{{ condition.label }}</div>
                <el-icon size="12" class="icon-color"> <AIcon icon="icon-shanchu1" /> </el-icon>
              </div>
            </div>
          </div>
          <div class="item-top item-top-clear" v-if="conditionList.length > 0" @click="clearConditionList">清空</div>
        </div>
        <div class="box-item" @click="intoModelInfo(item)" v-for="(item, index) in filterModelList" :key="index">
          <div class="item-model-title">
            <div class="item-model-title-left">
              {{ item.name }} &nbsp;&nbsp;
              <el-icon size="20" class="icon-color" @click="copyRecord(item.name)"> <AIcon icon="icon-fuzhi" /> </el-icon>
            </div>
            <div class="item-model-title-right">{{ item.allTokens }} Token</div>
          </div>
          <div class="item-model-text">
            {{ item.introduce }}
          </div>
          <div class="item-model-tips">
            by:{{ item.supplierName }}&nbsp; {{ item.contextLength }}上下文&nbsp; 输入:{{ item.inPrice }}{{ item.inPriceUnit }}&nbsp; 输出:{{
              item.outPrice
            }}{{ item.outPriceUnit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AIcon from '@/components/AAUI/AIcon/AIcon.vue';
import { useModelSerch } from './hook/useModelSerch';
import { ElIcon, ElMessage } from 'element-plus';
import { copyToClipboard } from '@/utils/commonUtil';
import { ref, h, onMounted, onUpdated, watchEffect, inject } from 'vue';
const emit = defineEmits(['changeShowFlag']);
const modelDetailAll = <any>inject('modelDetailAll');
const {
  inputFilter,
  options,
  searchType,
  textLen,
  marks,
  minPrice,
  maxPrice,
  supplierList,
  hotAbilityList,
  textAbilityList,
  tagList,
  getAllDict,
  conditionList,
  conditionFlag,
  conditionListFlag,
  addConditionList,
  delConditionList,
  clearConditionList,
  getModelList,
  modelList,
  filterModelList,
} = useModelSerch();

//复制功能
const copyRecord = (item: string) => {
  const content = item;
  // console.log();

  copyToClipboard({
    content,
    success() {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    },
    error() {
      ElMessage({
        message: '复制失败',
        type: 'error',
      });
    },
  });
};
const intoModelInfo = (item: string) => {
  modelDetailAll.value = item;
  emit('changeShowFlag', 1);
};
const clearPrice = () => {
  maxPrice.value = undefined;
  minPrice.value = undefined;
};
onMounted(() => {
  //初始化
  getAllDict();
  getModelList();
});
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  width: 100%;
  height: 100%;
  .box-1 {
    height: 100%;
    margin-right: 10px;
    // max-width: 40%;
    display: flex;
    flex-direction: column;
    flex: 2;
    .box-start {
      display: flex;
      align-items: center;
      padding: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      box-shadow: 0 0px 5px rgb(137, 129, 248, 0.15);
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
      overflow: auto;
    }
    .box-center {
      display: flex;
      flex-direction: column;
      // align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      box-shadow: 0 0px 5px rgb(137, 129, 248, 0.15);
      background-color: #fff;
      border-radius: 10px;
      overflow: auto;
    }
    .box-small {
      font-size: 12px;
      font-weight: bold;
      color: #016fa0;
      margin: 10px 0;
    }
    .box-text {
      font-size: 16px;
      font-weight: bold;
      // width: 95px;
      width: 20%;
    }
    .box-slider {
      margin-left: 5px;
      width: 75%;
    }
    .box-block {
      display: flex;
      flex-direction: row;
      margin: 5px 0px;
      flex-wrap: wrap;
    }
    .box-btn1 {
      cursor: pointer;
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #d7d7d7;
      border-radius: 5px;

      font-size: 13px;
      &:hover {
        background-color: var(--el-menu-hover-bg-color);
        border-radius: 5px;
      }
    }
    .box-btn {
      cursor: pointer;
      padding: 5px;
      font-size: 13px;
      margin-right: 15px;
      // height: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &:hover {
        // background-color: var(--el-menu-hover-bg-color);
        background: url('@/assets/image/modelList/largeModelItembg.png') no-repeat;
        background-size: 100% 100%;
        border-radius: 5px;
      }
      .box-model {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
          height: 30px;
        }
      }
      .box-model-name {
        width: 150px;
        padding-right: 10px;
        // margin-top: 10px;
        display: flex;
        align-items: center;
        // justify-content: center;
        padding-left: 37px;
        font-size: 11px;
        color: #7f7f7f;
      }
    }
    .box-btn2 {
      cursor: pointer;
      padding: 5px;
      font-size: 13px;
      margin-right: 15px;

      // height: 30px;
      display: flex;
      flex-direction: column;
      min-width: 62px;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: var(--el-menu-hover-bg-color);
        border-radius: 5px;
      }
      .box-model {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
          height: 30px;
        }
      }
      .box-model-name {
        width: 150px;
        padding-right: 10px;
        // margin-top: 10px;
        display: flex;
        align-items: center;
        // justify-content: center;
        padding-left: 37px;
        font-size: 11px;
        color: #7f7f7f;
      }
    }
    .isActive {
      background-color: var(--el-menu-hover-bg-color);

      border-radius: 5px;
    }
    .isSelectModelActive {
      background: url('@/assets/image/modelList/largeModelItembg.png') no-repeat;
      background-size: 100% 100%;

      border-radius: 5px;
    }
    .box-boder-btn {
      border: 1px solid var(--el-menu-hover-bg-color);
      border-radius: 5px;
      margin-bottom: 10px;
    }
  }
  .box-2 {
    flex: 3;
    height: 100%;
    display: flex;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0px 5px rgb(137, 129, 248, 0.15);
    padding: 10px;
    flex-direction: column;
    .search {
      flex: 6;
      padding-top: 10px;
      display: flex;
      // justify-content: center;
      :deep(.el-input) {
        --el-input-border-color: #aaa;
        --el-border-color-hover: var(--el-menu-active-bg-color);
        --el-border-radius-base: 10px;
        --el-input-focus-border-color: #aaa;
      }
      :deep(.el-select) {
        --el-select-input-focus-border-color: #aaa;
        --el-select-border-color-hover: var(--el-menu-active-bg-color);
      }
    }
    .box-list {
      overflow: auto;
      // margin-top: 20px;
      background-color: #f5f5ff;
      width: 100%;
      flex: 91;
      height: calc(100% - 20px - 40px);
      border-radius: 10px;
      padding: 10px;
      .box-item {
        cursor: pointer;
        font-size: 13px;
        background-color: #fff;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        .item-model-title {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          .item-model-title-left {
            display: flex;
            justify-content: center;
            align-items: center;
            .icon-color {
              color: #aaa;
              cursor: pointer;
            }
          }
          .item-model-title-right {
            font-size: 12px;
          }
        }
        .item-model-text {
          margin: 15px 0px;
          font-size: 13px;
          // text-indent: 2em;
        }
        .item-model-tips {
          font-size: 12px;
          color: #7f7f7f;
        }
      }
      .box-item-top {
        font-size: 13px;
        background-color: #fff;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        display: flex;
        .item-top {
          display: flex;
          align-items: center;
          .item-btn-box {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            flex: 1;
          }
          .item-top-text {
            color: var(--el-menu-active-bg-color);
          }
          .item-top-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 2px;
            border-radius: 5px;
            border: 1px solid #d7d7d7;
            min-width: 100px;
            margin-left: 5px;

            // margin-bottom: 5px;
            .item-top-btn-text {
              flex: 1;
              display: flex;
              justify-content: center;
            }
            .icon-color {
              align-self: flex-start;
              color: #aaa;
              cursor: pointer;
            }
          }
        }
        .item-top-clear {
          min-width: 30px;
          margin-left: 5px;
          display: flex;
          cursor: pointer;
          &:hover {
            color: var(--el-menu-active-bg-color);
          }
        }
      }
    }
  }
}
.box-btn5 {
  cursor: pointer;
  padding: 5px;
  font-size: 13px;
  margin-right: 15px;

  // height: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:hover {
    background-color: var(--el-menu-hover-bg-color);
    border-radius: 5px;
  }
  .box-model {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    img {
      height: 30px;
    }
  }
  .box-model-name {
    width: 150px;
    padding-right: 10px;
    // margin-top: 10px;
    display: flex;
    align-items: center;
    // justify-content: center;
    padding-left: 37px;
    font-size: 11px;
    color: #7f7f7f;
  }
}
</style>
