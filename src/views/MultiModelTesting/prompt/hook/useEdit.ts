import { IForm } from '@/components/AAUI';
import { computed, ref, watch, reactive } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
// import { addKey, editKey, deleteKey } from '@/api/APIManagement/management';
import { getPromptList, getTagList, deletePromptList, createPromptList, modifyPromptList } from '@/api/MultiModelTesting/modelTesting';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';

export const useEdit = () => {
  const editFormRef = ref();
  const isShowEditDialog = ref<boolean>(false);
  const editFormLoading = ref<boolean>(false);
  watch(isShowEditDialog, () => {
    editFormRef.value && editFormRef.value.resetFields();
  });

  const editFormList = computed<IForm[]>(() => [
    {
      label: '密钥名称',
      prop: 'keyName',
      type: 'input',
      option: { placeholder: '例如:"聊天机器人密钥"' },
    },
    {
      label: 'Token额度（可选）',
      prop: 'tokenQuota',
      type: 'input',
      option: { placeholder: '留空表示无限制' },
    },
  ]);
  const isCreated = ref<boolean>(false);
  const editFormData = ref<any>({
    userId: userId,
    promptTitle: '',
    promptDetailDoList: [
      {
        createBy: userId,
        promptContext: '',
        promptTitle: '',
        role: '',
        seq: 0,
      },
    ],
  });
  const checkPrompt = (rule: any, value: any, callback: any) => {
    value.forEach((element: any) => {
      if (element.role == '') {
        return callback(new Error('Please input the role'));
      }
      if (element.promptContext == '') {
        return callback(new Error('Please input the promptContext'));
      }
    });
    if (!value) {
      return callback(new Error('Please input the age'));
    }
    return callback();
  };
  const editFormRules: FormRules = {
    promptTitle: [{ required: true, message: '请输入标题' }],
    promptDetailDoList: [{ validator: checkPrompt, message: '请输入提示词' }],
  };

  const addHandleSync = (data: any) => {
    return new Promise((resolve, reject) => {
      createPromptList(data).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('提交成功');
          resolve(res);
        } else {
          ElMessage.error(res.msg || '提交失败');
          reject(res);
        }
      });
    });
  };

  const editHandleSync = (data: any) => {
    editFormLoading.value = true;
    return new Promise((resolve, reject) => {
      modifyPromptList(data).then((res: any) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('提交成功');
          resolve(res);
        } else {
          ElMessage.error(res.msg || '提交失败');
          reject(res);
        }
      });
    });
  };

  // const deleteHandleSync = (apiKey: string) => {
  //   return new Promise((resolve, reject) => {
  //     deleteKey({ apiKey }).then((res) => {
  //       if (res.code === 0 && res.success) {
  //         ElMessage.success('删除成功');
  //         resolve(res);
  //       } else {
  //         ElMessage.error(res.msg || '删除失败');
  //         reject(res);
  //       }
  //     });
  //   });
  // };

  const inputFilter = ref('');
  const tableData = ref<any[]>([]);
  const tableDataLoading = ref(false);

  const getTableList = async (user: string, tag: string) => {
    try {
      if (tag === '全部') {
        tag = '';
      }
      tableDataLoading.value = true;
      const res = await getPromptList({ user, tag });
      if (res.code === 0) {
        if (res?.data?.length > 0) {
          tableData.value = res.data;
          // totalData.value = res.data.length || 0;
        } else {
          tableData.value = [];
          // totalData.value = 0;
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      tableDataLoading.value = false;
    }
  };

  const filterTableDate = computed(() => (str: string) => {
    return tableData.value.filter((item) => {
      if (str === '') {
        return item;
      }
      if (item?.promptTitle && item?.promptTitle?.indexOf(str) !== -1) {
        return item;
      }
    });
  });

  const getStrFliter = (item: any) => {
    let str = '';

    item.promptDetailDoList.map((item: any) => {
      str += item.promptContext + ';';
    });
    return str;
  };

  const tableTag = ref([]);
  const getTableTag = async () => {
    const res = await getTagList();

    if (res.code === 0) {
      tableTag.value = res.data;
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };

  const deletePrompt = (date: any) => {
    return new Promise((resolve, reject) => {
      deletePromptList(date).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('删除成功');
          resolve(res);
        } else {
          reject(res);
          ElMessage.error(res.msg || '删除失败');
        }
      });
    });
  };

  return {
    editFormRef,
    editFormList,
    editFormData,
    editFormRules,
    isShowEditDialog,
    editFormLoading,
    addHandleSync,
    editHandleSync,
    // deleteHandleSync,
    isCreated,

    inputFilter,
    filterTableDate,
    getTableList,
    getStrFliter,
    tableDataLoading,
    tableData,
    deletePrompt,

    tableTag,
    getTableTag,
  };
};
