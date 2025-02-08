import { ElMessageBox } from 'element-plus';
import { ISearchAction } from 'monose-component-vue';
import { Ref, computed } from 'vue';

export const useEditButton = (
  isEdit: Ref<boolean>,
  option?: { submitHandle?: () => Promise<any>; cancelHandle?: () => void; append?: ISearchAction[]; action?: (method: string) => void },
) => {
  const { submitHandle, cancelHandle, append, action } = option || {};
  const temp: ISearchAction[] = [
    { label: '编辑', prop: 'edit', type: 'button' },
    { label: '取消', prop: 'cancel', type: 'button', option: { type: 'danger' } },
    { label: '确认', prop: 'submit', type: 'button', option: { type: 'primary' } },
  ];
  const actionList = computed(() => {
    if (isEdit.value) {
      return temp.slice(1);
    } else {
      return [...temp.slice(0, 1), ...(append || [])];
    }
  });
  const actionClick = (method: string) => {
    if (method === 'edit') {
      isEdit.value = true;
    } else if (method === 'cancel') {
      ElMessageBox.confirm('点击取消后将丢失修改的内容', { type: 'warning' }).then(() => {
        isEdit.value = false;
        cancelHandle && cancelHandle();
      });
    } else if (method === 'submit') {
      if (submitHandle) {
        submitHandle().then(() => (isEdit.value = false));
      }
    } else {
      action && action(method);
    }
  };

  return {
    actionList,
    actionClick,
  };
};
