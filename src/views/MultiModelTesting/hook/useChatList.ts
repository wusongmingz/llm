import { IForm } from '@/components/AAUI';
import { computed, ref, watch, reactive } from 'vue';
import { ElMessage, FormRules, dayjs } from 'element-plus';
import { newChat, getChatList, delChatList, delChat } from '@/api/MultiModelTesting/modelTesting';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';

export const useChatList = () => {
  const chatList = ref<any>(new Map());
  const chatListFlag = ref<boolean>(false);
  const chatNew = ref({ conversationId: '', content: '', sessionId: '', createTime: '' });
  const inputFilter = ref('');
  // const editFormRef = ref();
  // const isShowEditDialog = ref<boolean>(false);
  // const editFormLoading = ref<boolean>(false);
  // watch(isShowEditDialog, () => {
  //   editFormRef.value && editFormRef.value.resetFields();
  // });

  // const editFormList = computed<IForm[]>(() => [
  //   {
  //     label: '密钥名称',
  //     prop: 'keyName',
  //     type: 'input',
  //     option: { placeholder: '例如:"聊天机器人密钥"' },
  //   },
  //   {
  //     label: 'Token额度（可选）',
  //     prop: 'tokenQuota',
  //     type: 'input',
  //     option: { placeholder: '留空表示无限制' },
  //   },
  // ]);
  // const key_textarea = ref<string>('aaaaaa');
  // const isCreated = ref<boolean>(false);
  // const editFormData = reactive<any>({
  //   title: '',
  //   domains: [
  //     {
  //       id: 0,
  //       selectValue: 'system',
  //       inputValue: '',
  //     },
  //     {
  //       id: 1,
  //       selectValue: 'user',
  //       inputValue: '',
  //     },
  //     {
  //       id: 2,
  //       selectValue: 'system',
  //       inputValue: '',
  //     },
  //   ],
  // });
  // const editFormRules: FormRules = {
  //   keyName: [{ required: true, message: '请输入密钥名称' }],
  //   tokenQuota: [{ required: false }],
  // };

  // const addHandleSync = () => {
  //   return new Promise((resolve, reject) => {
  //     addKey({
  //       userId: '1',
  //       tokenQuota: editFormData.value.tokenQuota,
  //       keyName: editFormData.value.keyName,
  //     }).then((res) => {
  //       if (res.code === 0 && res.success) {
  //         ElMessage.success('提交成功');
  //         key_textarea.value = res.data?.apiKey;
  //         resolve(res);
  //       } else {
  //         ElMessage.error(res.msg || '提交失败');
  //         reject(res);
  //       }
  //     });
  //   });
  // };

  // const editHandleSync = () => {
  //   return new Promise((resolve, reject) => {
  //     editKey({
  //       userId: '1',
  //       tokenQuota: editFormData.value.tokenQuota,
  //       keyName: editFormData.value.keyName,
  //       apiKey: editFormData.value.apiKey,
  //     }).then((res) => {
  //       if (res.code === 0 && res.success) {
  //         ElMessage.success('提交成功');
  //         // key_textarea.value = res.data?.apiKey;
  //         resolve(res);
  //       } else {
  //         ElMessage.error(res.msg || '提交失败');
  //         reject(res);
  //       }
  //     });
  //   });
  // };

  // const deleteHandleSync = (apiKey: string) => {
  //   return new Promise((resolve, reject) => {
  //     deleteKey({ apiKey }).then((res) => {
  //       if (res.code === 0 && res.success) {
  //         ElMessage.success('删除成功');
  //         // key_textarea.value = res.data?.apiKey;
  //         resolve(res);
  //       } else {
  //         ElMessage.error(res.msg || '删除失败');
  //         reject(res);
  //       }
  //     });
  //   });
  // };

  // const inputFilter = ref('');
  // const tableData = ref<any[]>([]);
  // const tableDataLoading = ref(false);

  // const getTableList = async (user: string, tag: string) => {
  //   try {
  //     if (tag === '全部') {
  //       tag = '';
  //     }
  //     tableDataLoading.value = true;
  //     const res = await getPromptList({ user, tag });
  //     if (res.code === 0) {
  //       if (res?.data?.length > 0) {
  //         tableData.value = res.data;
  //         // totalData.value = res.data.length || 0;
  //       } else {
  //         tableData.value = [];
  //         // totalData.value = 0;
  //       }
  //     } else {
  //       ElMessage.error(res.msg || '网络错误');
  //     }
  //   } finally {
  //     tableDataLoading.value = false;
  //   }
  // };

  // const filterTableDate = computed(() => (str: string) => {
  //   return tableData.value.filter((item) => {
  //     if (str === '') {
  //       return item;
  //     }
  //     if (item?.promptTitle?.indexOf(str) !== -1) {
  //       return item;
  //     }
  //   });
  // });

  // const getStrFliter = (item: any) => {
  //   let str = '';

  //   item.promptDetailDoList.map((item: any) => {
  //     str += item.promptContext + ';';
  //   });
  //   return str;
  // };

  // const tableTag = ref([]);
  // const getTableTag = async () => {
  //   const res = await getTagList();

  //   if (res.code === 0) {
  //     tableTag.value = res.data;
  //   } else {
  //     ElMessage.error(res.msg || '网络错误');
  //   }
  // };

  const delChatContext = (conversationId: string) => {
    return new Promise((resolve, reject) => {
      delChat({ userId: userId, conversationId: conversationId }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('删除成功');
          resolve(res);
          // key_textarea.value = res.data?.apiKey;
        } else {
          reject(res);
          ElMessage.error(res.msg || '删除失败');
        }
      });
    });
  };

  const clearChatList = () => {
    return new Promise((resolve, reject) => {
      delChatList({ userId: userId }).then((res) => {
        if (res.code === 0 && res.success) {
          ElMessage.success('删除成功');
          resolve(res);
          // key_textarea.value = res.data?.apiKey;
        } else {
          reject(res);
          ElMessage.error(res.msg || '删除失败');
        }
      });
    });
  };

  const addHandleSync = (data: { userId: string }) => {
    return new Promise((resolve, reject) => {
      newChat(data).then((res) => {
        if (res.code === 0 && res.success) {
          if (res.data) {
            chatNew.value.conversationId = res.data.conversationId;
            chatNew.value.sessionId = res.data.sessionId;
          }
          // ElMessage.success('创建成功');
          resolve(res);
        } else {
          ElMessage.error(res.msg || '创建失败');
          reject(res);
        }
      });
    });
  };

  const getList = async (userId: string) => {
    chatListFlag.value = true;
    const res = await getChatList({ userId });

    if (res.code === 0) {
      if (res.data) {
        // res.data.map((item: any) => {
        //   item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm');
        // });
        for (const x of Object.keys(res.data)) {
          res.data[x].map((item: any) => {
            item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm');
          });
        }

        chatList.value = res.data;
        // chatList.value = res.data['今天'];
        //【11.27】点击路由不展示默认聊天
        // if (res.data.length > 0) {
        //   chatNew.value.conversationId = res.data[0].conversationId;
        //   chatNew.value.sessionId = res.data[0].sessionId;
        // }
      } else {
        chatList.value = [];
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
    chatListFlag.value = false;
  };

  const filterChatList = computed(() => {
    // return chatList.value.filter((item: any) => {
    //   if (inputFilter.value === '') {
    //     return item;
    //   }
    //   if (item?.content && item?.content?.indexOf(inputFilter.value) !== -1) {
    //     return item;
    //   }
    // });
    // const result: { [key: string]: any } = {};

    // const [timeTitle, timeData] of Object.entries(chatList.value)
    // for(const [timeTitle, timeData] of Object.entries(chatList.value)){
    //   console.log(timeData,3333);

    //   const filteredTimeData  = (timeData as [string, any[]]).filter(([key, item])=>{
    //     if (inputFilter.value === '') {
    //       return true;
    //     }
    //     if (item?.content && item?.content?.indexOf(inputFilter.value) !== -1) {
    //       return true;
    //     }
    //     return false
    //   })
    //   if(filteredTimeData.length > 0){
    //     result[timeTitle] = filteredTimeData
    //   }

    // }
    // console.log(result,2222);
    const x = <any>{};
    Object.assign(x, chatList.value);
    // console.log('jiekou',x)
    const arr = Object.keys(chatList.value);
    // console.log(arr)
    for (const temp of arr) {
      // console.log(temp)
      const t = x[temp].filter((item: any) => {
        if (inputFilter.value === '') {
          return item;
        }
        if (item?.content && item?.content?.indexOf(inputFilter.value) !== -1) {
          return item;
        }
      });
      x[temp] = t;
      if (x[temp].length === 0) {
        // delete x[temp]
      }
      // console.log(x[temp])
      // x.set(temp,t)
      // Object.assign(x[temp],t)
      // console.log(t)
      // console.log(x[temp])
    }
    // console.log(x)

    return x;

    // return result;
    // return chatList.value;
  });

  return {
    chatList,
    chatListFlag,
    chatNew,
    inputFilter,
    filterChatList,
    // editFormRef,
    // editFormList,
    // editFormData,
    // editFormRules,
    // isShowEditDialog,
    // editFormLoading,
    getList,
    addHandleSync,
    clearChatList,
    delChatContext,
    // editHandleSync,
    // deleteHandleSync,
    // isCreated,
    // key_textarea,
    // inputFilter,
    // filterTableDate,
    // getTableList,
    // getStrFliter,
    // tableDataLoading,
    // tableData,
    // deletePrompt,
    // tableTag,
    // getTableTag,
  };
};
