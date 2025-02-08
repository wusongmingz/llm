import { computed, ref } from 'vue';
import { getChatModelList } from '@/api/MultiModelTesting/modelTesting';
import {
  getServiceList,
  getTokens,
  getModelDefault,
  modifyDefaultModel,
  getServiceDiffList,
  modifyUserSupplierException,
  getMaxToken,
  modifyMaxToken,
} from '@/api/UserInformation/information';
import { ElMessage, FormRules } from 'element-plus';

export const useModelList = () => {
  const tokens = ref(0);

  const excludeServiceList = ref<any>([]);
  const excludeService = ref('');
  const excludeServiceDict = ref<any>([]);

  const excludeModelList = ref([]);
  const excludeModel = ref('');
  const excludeModelDict = ref<any>([]);

  const maxToken = ref(null);

  const isLoading = ref(false);
  const getInfoInit = (userId: string) => {
    isLoading.value = true;
    //初始化执行
    Promise.allSettled([
      getTokens({ userId }),
      getServiceList(),
      getChatModelList(),
      getModelDefault({ userId }),
      getServiceDiffList({ userId }),
      // getMaxToken({ userId }),
    ]).then((results) => {
      // 处理所有Promise完成的情况
      // console.log(results);
      //token用量
      if (results[0].value?.code == 0 && results[0].value?.success == true) {
        tokens.value = results[0].value?.data;
      }
      //供应商列表
      if (results[1].value?.code == 0 && results[1].value?.success == true) {
        excludeServiceDict.value = results[1].value?.data || [];
      }
      //默认模型列表
      if (results[2].value?.code == 0 && results[2].value?.success == true) {
        excludeModelDict.value = results[2].value?.data || [];
      }
      //默认模型
      if (results[3].value?.code == 0 && results[3].value?.success == true) {
        excludeModel.value = results[3].value?.data;
      }
      //查看用户排除的服务商列表
      if (results[4].value?.code == 0 && results[4].value?.success == true) {
        excludeServiceList.value = results[4].value?.data || [];
      }
      //查看用户maxtoken
      // if (results[5].value?.code == 0 && results[5].value?.success == true) {
      //   maxToken.value = results[5].value?.data;
      // }
      isLoading.value = false;
    });
  };

  const changeModelDefault = async (userId: string, modelId: number) => {
    await modifyDefaultModel({ userId, modelId });
  };
  const changeService = async (userId: string, suppliers: string) => {
    await modifyUserSupplierException({ userId, suppliers });
    const res = await getServiceDiffList({ userId });
    if (res.code == 0 && res.success == true) {
      excludeServiceList.value = res.data || [];
    }
  };
  const changeMaxToken = async (userId: string, maxToken: any) => {
    const res = await modifyMaxToken({ userId, maxToken });
    if (res.code == 0 && res.success == true) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.error(res.msg || '修改失败');
    }
  };
  return {
    tokens,
    excludeServiceList,
    excludeService,
    excludeServiceDict,
    excludeModelList,
    excludeModel,
    excludeModelDict,
    getInfoInit,
    changeModelDefault,
    changeService,
    maxToken,
    changeMaxToken,
    isLoading,
  };
};
