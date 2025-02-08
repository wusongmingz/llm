import { IForm } from '@/components/AAUI';
import { computed, ref, watch } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
import { changePassword } from '@/api/setting/user';

export const useEdit = () => {
  const editFormRef = ref();
  const isShowEditDialog = ref<boolean>(false);
  const editFormLoading = ref<boolean>(false);
  watch(isShowEditDialog, () => {
    editFormRef.value && editFormRef.value.resetFields();
  });

  const editFormList = computed<IForm[]>(() => [
    { label: '旧密码', prop: 'oldPassword', type: 'input', option: { type: 'password' } },
    { label: '新密码', prop: 'newPassword', type: 'input', option: { type: 'password', onInput: checkPwdLevel } },
    { label: '确认密码', prop: 'againPassword', type: 'input', option: { type: 'password' } },
    // { label: '密码强度', prop: 'pwdLevel', type: 'slot' },
  ]);
  const pwdLevel = ref();
  const editFormData = ref<any>({});
  const validatePass = (rule: any, value: any, callback: any) => {
    if (/\d/.test(value) && /[a-zA-Z]/.test(value) && /[^a-zA-Z0-9]/.test(value)) {
      callback();
    } else {
      callback(new Error('新密码必须同时包含数字字母和特殊符号'));
    }
  };
  const editFormRules: FormRules = {
    oldPassword: [{ required: true, message: '请输入旧密码' }],
    newPassword: [
      { required: true, message: '请输入新密码' },
      { min: 8, max: 16, message: '密码长度在8-16之间', trigger: 'blur' },
      { validator: validatePass, trigger: 'blur' },
    ],
    againPassword: [
      { required: true, message: '请输入确认密码' },
      { min: 8, max: 16, message: '密码长度在8-16之间', trigger: 'blur' },
      { validator: validatePass, trigger: 'blur' },
    ],
  };
  const checkPwdLevel = (e: any) => {
    if (e.length === 0) {
      pwdLevel.value = '';
    } else if (/\d/.test(e) && /[a-zA-Z]/.test(e) && /\W/.test(e)) {
      // 同时包含数字、字母、特殊字符
      pwdLevel.value = 2;
    } else if (/\d/.test(e) && /[a-zA-Z]/.test(e)) {
      // 至少包含数字或字母
      pwdLevel.value = 1;
    } else if (/\d/.test(e) || /[a-zA-Z]/.test(e)) {
      // 至少包含数字或字母
      pwdLevel.value = 0;
    } else {
      pwdLevel.value = '';
    }
  };

  const editHandleSync = () => {
    return new Promise((resolve, reject) => {
      changePassword({
        oldPassword: editFormData.value.oldPassword,
        newPassword: editFormData.value.newPassword,
      }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('重置密码成功');
          resolve(res);
        } else {
          ElMessage.error(res.msg || '重置密码失败');
          reject(res);
        }
      });
    });
  };

  return {
    pwdLevel,
    editFormRef,
    editFormList,
    editFormData,
    editFormRules,
    isShowEditDialog,
    editFormLoading,
    editHandleSync,
  };
};
