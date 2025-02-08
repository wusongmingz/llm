import { ITableHead, ITableAction, ITableConfig } from '@/components/AAUI';
import { ref } from 'vue';
// import { PeakingPlanAction, dealShow } from '../types';
import { getKeyList } from '@/api/APIManagement/management';
import { ElMessage } from 'element-plus';
import { clearEmptyFields } from '@/utils/utils';

export const useList = () => {
  // table part
  const tableHead: ITableHead[] = [
    { label: '名称', prop: 'keyName', align: 'left' },
    { label: 'Token额度', prop: 'tokenQuota', align: 'left' },
    { label: 'Key', prop: 'apiKey', align: 'left' },
    { label: '操作', prop: 'do', align: 'left' },
  ];
  const tableConfig: ITableConfig = {
    defaultSort: { prop: 'time', order: 'descending' },
    showSummary: true,
    border: false,
    // height: '530',
  };

  const totalData = ref(0);
  const tableData = ref<any[]>([]);
  const tableLoading = ref<boolean>(false);
  const tableActionList: ITableAction[] = [
    { label: '查看', prop: 'show', icon: 'icon-chakan' },
    { label: '编辑', prop: 'edit', icon: 'icon-bianji' },
    { label: '删除', prop: 'remove', icon: 'icon-shanchu' },
  ];

  const getTableList = async (userId: string) => {
    try {
      const res = await getKeyList(userId);
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          // tableData.value = res.data.records.map((item) => dealShow(item));
          tableData.value = res.data.map((item: any) => {
            item.visible = false; //控制删除弹框
            return item;
          });
          totalData.value = res.data.length || 0;
        } else {
          tableData.value = [];
          totalData.value = 0;
        }
      } else {
        ElMessage.error(res.msg || '网络错误');
      }
    } finally {
      tableLoading.value = false;
    }
  };

  //   const deletePlanSync = (planId: number) => {
  //     return new Promise((resolve, reject) => {
  //       deletePlan(planId).then((res) => {
  //         if (res.code === 0 && res.data) {
  //           ElMessage.success('作废成功');
  //           resolve(res);
  //         } else {
  //           ElMessage.error(res.msg || '作废失败');
  //           reject(res);
  //         }
  //       });
  //     });
  //   };

  return {
    tableHead,
    totalData,
    tableData,
    tableConfig,
    tableActionList,
    tableLoading,
    getTableList,
    // deletePlanSync,
  };
};
