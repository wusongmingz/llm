import { computed, ref, watch, reactive, inject } from 'vue';
import { filterSuppliert, filterContextLength, filterModel } from '@/api/MultiModelTesting/modelTesting';
import { getModelDefault, getServiceDiffList } from '@/api/UserInformation/information';
import { ElMessage, FormRules, dayjs } from 'element-plus';
import { clearEmptyFields } from '@/utils/utils';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userModelList = computed(() => userStore.modelList);
const userId = userStore.sysUser?.userID || '';
export const userSelect = () => {
  const loadFlag = ref(false);

  const contextLength = ref('');
  const superplay = ref('');
  const isOpen = ref('');
  const options1 = ref<any>([]);
  const options2 = ref<any>([]);

  const listData = <any>inject('listData');

  const iconList = <any>inject('iconList');
  //刷新列表依然影响
  const moreModel = ref<any>([]);

  //供应商列表
  const getSuppliert = () => {
    return new Promise((resolve, reject) => {
      filterSuppliert().then((res) => {
        if (res.code === 0 && res.success) {
          if (res.data) {
            options1.value = res.data.map((item: any) => {
              return {
                label: item.supplierName,
                value: item.supplierId,
                icon: item.icon,
              };
            });
          }
          resolve(res);
        } else {
          reject(res);
          ElMessage.error(res.msg || '未知异常');
        }
      });
    });
  };
  //上下文列表
  const getContextLength = () => {
    return new Promise((resolve, reject) => {
      filterContextLength().then((res) => {
        if (res.code === 0 && res.success) {
          if (res.data) {
            options2.value = res.data.map((item: any) => {
              return {
                label: item,
                value: item,
              };
            });
          }
          resolve(res);
        } else {
          reject(res);
          ElMessage.error(res.msg || '未知异常');
        }
      });
    });
  };
  //获取模型列表
  const getFilterModel = () => {
    const params = { contextLength: contextLength.value, supplierId: superplay.value, isOpen: isOpen.value };
    listData.value = [];
    loadFlag.value = true;
    return new Promise((resolve, reject) => {
      filterModel(clearEmptyFields(params)).then((res) => {
        if (res.code === 0 && res.success) {
          if (res.data) {
            listData.value = res.data;
            //模型列表要根据iconlist进行赋予临时
            for (const temp in res.data) {
              listData.value[temp].map((item: any) => {
                if (iconList.value.length >= 5) {
                  item.tempDisabled = true;
                }

                iconList.value.map((iconModel: any) => {
                  if (item.name == iconModel.name) {
                    item.flag = true;
                    item.tempDisabled = false;
                  }
                });
              });
            }

            //获取用户排除供应商
            addDisableModel(userId);
          }
          loadFlag.value = false;
          resolve(res);
        } else {
          reject(res);
          loadFlag.value = false;
          ElMessage.error(res.msg || '未知异常');
        }
      });
    });
  };
  //获取排除的供应商
  const addDisableModel = async (userId: string) => {
    const res = await getServiceDiffList({ userId });

    if (res.code === 0) {
      if (res.data) {
        res.data.map((temp: any) => {
          if (listData.value[temp.supplierName]) {
            listData.value[temp.supplierName].map((item: any) => {
              item.disabled = true;
            });
          }

          // newModelOptions.value.map((item: any) => {
          //   if (temp.supplierId === item.supplierId) {
          //     item.disabled = true;
          //   }
          // });
        });
        // console.log(newModelOptions.value);
        // newModelOptions.value = res.data;
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };
  //点击按钮给列表增加或者删除
  const changeFlag = (data: any) => {
    //如果是勾选那么，列表添加,否则列表移除
    if (data.flag) {
      iconList.value.push(data);
    } else {
      iconList.value = iconList.value.filter((item: any) => item.name !== data.name);
    }
  };
  //点击模型
  const changeFlag1Box = (data: any) => {
    if (data.disabled || data.tempDisabled) {
      return;
    }
    //如果是勾选那么，列表添加,否则列表移除
    data.flag = !data.flag;
    if (data.flag) {
      iconList.value.push(data);
    } else {
      iconList.value = iconList.value.filter((item: any) => item.name !== data.name);
    }
  };

  watch(
    iconList,
    (newValue, oldValue) => {
      if (newValue.length == 4 || newValue.length == 5) {
        if (iconList.value.length >= 5) {
          moreModel.value = true;
          for (const temp in listData.value) {
            listData.value[temp].map((item: any) => {
              if (!item.flag) item.tempDisabled = true;
            });
          }
        } else {
          moreModel.value = false;
          for (const temp in listData.value) {
            listData.value[temp].map((item: any) => {
              item.tempDisabled = false;
            });
          }
        }
      }
    },
    {
      deep: true,
    },
  );
  //初始化
  const init = () => {
    getSuppliert();
    getContextLength();
    getFilterModel().then(() => {
      //读取缓存里的勾选状态
      if (userModelList.value.length > 0) {
        //赋值
        iconList.value = userModelList.value;
        //给列表加上勾选状态
        for (const i in iconList.value) {
          for (const temp in listData.value) {
            listData.value[temp].map((item: any) => {
              if (iconList.value[i].name == item.name) {
                item.flag = true;
              }
            });
          }
        }
      } else {
        //读取用户默认模型
        getModelDefault({ userId }).then((res) => {
          if (res.code === 0) {
            if (res.data) {
              for (const temp in listData.value) {
                listData.value[temp].map((item: any) => {
                  if (res.data == item.name) {
                    item.flag = true;
                    iconList.value.push(item);
                  }
                });
              }
            }
          } else {
            ElMessage.error(res.msg || '网络错误');
          }
        });
      }
    });
  };

  return { iconList, loadFlag, init, contextLength, options1, isOpen, superplay, options2, listData, getFilterModel, changeFlag, changeFlag1Box };
};
