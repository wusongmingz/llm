import { IForm } from '@/components/AAUI';
import { computed, ref, watch, nextTick } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
import { addKey, editKey, deleteKey } from '@/api/APIManagement/management';
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
  const key_textarea = ref<string>('aaaaaa');
  const isCreated = ref<boolean>(false);
  const editFormData = ref<any>({});
  const editFormRules: FormRules = {
    keyName: [{ required: true, message: '请输入密钥名称' }],
    tokenQuota: [{ required: false }],
  };

  const addHandleSync = () => {
    return new Promise((resolve, reject) => {
      addKey({
        userId: userId,
        tokenQuota: editFormData.value.tokenQuota,
        keyName: editFormData.value.keyName,
      }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('提交成功');
          key_textarea.value = res.data?.apiKey;
          resolve(res);
        } else {
          ElMessage.error(res.msg || '提交失败');
          reject(res);
        }
      });
    });
  };

  const editHandleSync = () => {
    return new Promise((resolve, reject) => {
      editKey({
        userId: userId,
        tokenQuota: editFormData.value.tokenQuota,
        keyName: editFormData.value.keyName,
        apiKey: editFormData.value.apiKey,
      }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('提交成功');
          // key_textarea.value = res.data?.apiKey;
          resolve(res);
        } else {
          ElMessage.error(res.msg || '提交失败');
          reject(res);
        }
      });
    });
  };

  const deleteHandleSync = (apiKey: string) => {
    return new Promise((resolve, reject) => {
      deleteKey({ apiKey }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('删除成功');
          // key_textarea.value = res.data?.apiKey;
          resolve(res);
        } else {
          ElMessage.error(res.msg || '删除失败');
          reject(res);
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
    deleteHandleSync,
    isCreated,
    key_textarea,
  };
};
