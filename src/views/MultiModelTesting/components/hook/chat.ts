/* eslint-disable prettier/prettier */
import {
  chatAI,
  getChatModelList,
  getChatDetail,
  conversationIdReq,
  getApiKeyList,
  getIsNewConversation,
  setConversationTitle,
} from '@/api/MultiModelTesting/modelTesting';
import { ElMessage, ElMessageBox, FormRules, dayjs } from 'element-plus';
import { computed, ref, watch, reactive, inject } from 'vue';
import { ChatItem } from './AiChatWebSocket';
import { getModelDefault, getServiceDiffList, getApiKey, getMaxToken } from '@/api/UserInformation/information';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const userId = userStore.sysUser?.userID || '';
const userModelList = computed(() => userStore.modelList);
export const useChat = () => {
  const iconList = <any>inject('iconList');
  const listData = <any>inject('listData');
  const maxCharCount = computed(() => {
    if (iconList.value.length == 0) {
      return 0;
    }
    return Math.floor(
      iconList.value.reduce(
        (min: any, current: any) => {
          if (!current.maxTokens) {
            return min;
          }
          return current.maxTokens < min.maxTokens ? current : min;
        },
        { maxTokens: 15000 },
      ).maxTokens / 3,
    );
  });
  //是否流式输出组件
  const switchValue = ref(true);
  //提示词列表
  const promptList = ref<any>([]);
  //提问问题内容
  const problemText = ref<string>('');
  //发送按钮的禁用状态
  const sendBtnDisabled = ref(false);
  //会话列表
  const chatList = ref<ChatItem[]>([]);
  const dealChatList = ref<any>([]);
  //apikey
  const apiKey = ref('');
  //获取apiKeyList
  const apiKeyList = ref<any>([]);
  //max_token
  const maxToken = ref<any>(null);
  const isNewChat = ref(true); //是否为第一次聊天

  //接口方法获取apiKeyList
  const getApiKeylList = async () => {
    const res = await getApiKeyList({ userId });

    if (res.code === 0) {
      if (res.data) {
        apiKeyList.value = res.data;
        apiKeyList.value.map((item: any) => {
          if (item.apiKey === apiKey.value && item.disabled) {
            ElMessage.error('apikey额度不足请更换');
          }
        });
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };

  const useApiData = async () => {
    const res = await getApiKey({ userId });
    if (res.code === 0) {
      if (res.data) {
        if (res.data?.apiKey) {
          apiKey.value = res.data?.apiKey;
        } else {
          ElMessage.error('无可用apikey,请先创建');
        }
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };
  // prettier-ignore
  const getChat = (formData: any, index: number) => {
    if (promptList.value.length > 0) {
      promptList.value.map((item: any) => {
        formData.messages.push({
          role: item.role,
          content: [
            {
              type: 'text',
              text: item.promptContext,
            },
          ],
        });
        // formData.max_tokens = formData.max_tokens - item.promptContext.length * 2
      });
      formData.messages.push(formData.messages.shift());
    }
    //考虑maxtokens为负数的情况 todo  提示词
    // if(formData.max_token<=0){
    //   formData.max_token = 0
    //   ElMessage.warning('模型：'+ formData.model +'您的提示词过长，请重新编辑或者更换模型');
    // }
    
    try {
      const url = '/api/ai-gateway/chatCompletions';
      const controller = new AbortController();
      if (switchValue.value) {
        formData.stream = true;
      } else {
        formData.stream = false;
      }
      // formData.max_tokens = maxToken.value;
      delete formData.max_tokens;
      formData.apiKey = apiKey.value;
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        signal: controller.signal,
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          'session_id': formData.sessionId,
          Authorization: 'Bearer ' + apiKey.value,
        },
      })
        .then((response) => {
          if (formData.stream) {
            //积累文本
            let accumulatedText = '';
            // 获取可读流
            const reader = response.body!.getReader();
            const decoder = new TextDecoder('utf-8');
            // 读取数据
            // eslint-disable-next-line no-inner-declarations
            function read() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    //设置聊天完成
                    chatList.value[index].loading = false;
                    //都聊天完成后，按钮解除禁用
                    for (let i = 0; i < chatList.value.length; i++) {
                      if (chatList.value[i]?.loading) {
                        break;
                      }
                      if (i == chatList.value.length - 1) {
                        sendBtnDisabled.value = false;
                      }
                    }
                    //刷新apikey列表
                    getApiKeylList()
                    return;
                  }
                  // 解码接收到的数据
                  const text = decoder.decode(value,{ stream: true });
                  accumulatedText += text;
                  // 按换行符分割数据块
                  const lines = accumulatedText.split('\n');
                  // 保留未完成的一行
                  accumulatedText = lines.pop()!;
                  lines.forEach((line) => {
                    if (line.trim()) {
                      // 确保非空行
                      if (line === 'event:message') {
                        // icType.value = Top;
                        return;
                      }
                      
                      // 移除前缀 'data: '
                      if (line.startsWith('data:')) {
                        line = line.substring(5);
                      }
                      
                      try {
                        if(line==='event: error'){
                          return
                        }
                        const jsonObj = JSON.parse(line);
                        
                        //openai返回的数据会有给一个{}的情况，所以要处理一下，空就跳过
                        if(Object.keys(jsonObj).length !== 0){
                          if(jsonObj.code==10004){
                              ElMessageBox({
                                title: '提示',
                                message: jsonObj.msg,
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonText: '确定',
                               
                              })
                            chatList.value[index].content += jsonObj.msg;
                            return
                          }
                          if (jsonObj.choices[0].delta.content) {
                            chatList.value[index].content += jsonObj.choices[0].delta.content;
                          }
                          if (!chatList.value[index].firstTime) {
                            //记录初始时间
                            chatList.value[index].firstTime = jsonObj.created;
                          }
                          if (jsonObj.choices[0].finishReason == 'stop' || jsonObj.choices[0].finishReason == 'STOP') {
                            //最后一条记录tokens
                            chatList.value[index].totalTokens = jsonObj.usage.totalTokens;
                            //最后一条计算耗时
                            chatList.value[index].LastTime = jsonObj.created;
                            chatList.value[index].responseTime = chatList.value[index].LastTime - chatList.value[index].firstTime;
                            chatList.value[index].responseSpeed = (chatList.value[index].totalTokens / chatList.value[index].responseTime).toFixed(1);
                          }
                        }
                        
                      } catch (error) {
                        console.error('JSON parse error:', error);
                      }
                    }
                  });
                  // 继续读取下一个数据块
                  read();
                })
                .catch((error) => {
                  // icType.value = Top;
                  console.error('Read error:', error);
                });
            }
            // 开始读取
            read();
          } else {
            return response.json();
          }
        })
        .then((res) => {
          // if (res?.code === 0) {
          if(res){
            if(res?.code !== 90000){
              if(res.code===10004){
                ElMessageBox({
                  title: '提示',
                  message: res.msg,
                  type: 'warning',
                  showCancelButton: false,
                  confirmButtonText: '确定',
    
                })
                chatList.value[index].loading = false;
                chatList.value[index].content += res.msg;
                sendBtnDisabled.value = false;
                return
              }
              if (res.choices[0]?.message?.content) {
                chatList.value[index].content += res.choices[0].message.content;
              }
              if (res?.usage?.totalTokens) {
                chatList.value[index].totalTokens = res.usage.totalTokens;
              }

              //刷新apikey列表
              getApiKeylList()
            }
              
            // }
            //结束操作
            chatList.value[index].loading = false;
            //都聊天完成后，按钮解除禁用
            for (let i = 0; i < chatList.value.length; i++) {
              if (chatList.value[i]?.loading) {
                break;
              }
              if (i == chatList.value.length - 1) {
                sendBtnDisabled.value = false;
              }
            }
          }
          
        })
        .catch((error) => {
          // icType.value = Top;
          console.error('Fetch error:', error);
        });
    } finally {
      // chatList.value[index].loading = false;
    }
  };
  const newModelOptions = ref<any>([]);
  const getModelList = async () => {
    const res = await getChatModelList();

    if (res.code === 0) {
      if (res.data) {
        newModelOptions.value = res.data;
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };

  //头部选择模型逻辑
  const newModelValue = ref();

  const removeModel = (index: number, item: any) => {
    iconList.value.splice(index, 1);
    for (const temp in listData.value) {
      listData.value[temp].map((t: any) => {
        if (t.name == item.name) {
          t.flag = false;
        }
      });
    }
  };

  const getHisTextList = async (data: conversationIdReq) => {
    const res = await getChatDetail(data);

    if (res.code === 0) {
      if (res.data) {
        res.data.map((item: any) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm');
          item.isNotShowHis = true;
        });
        chatList.value = res.data;
      } else {
        // chatList.value = [];
      }
    } else {
      ElMessage.error(res.msg || '网络错误');
    }
  };

  const getMaxTokenInit = async () => {
    const res = await getMaxToken({ userId });
    if (res.code == 0 && res.success == true) {
      maxToken.value = res.data;
    }
  };

  return {
    maxCharCount,
    switchValue,
    apiKey,
    useApiData,

    //聊天
    problemText,
    sendBtnDisabled,

    getChat,
    getModelList,
    iconList,
    // addNewModel,
    removeModel,
    newModelValue,
    // getModelDef,
    newModelOptions,
    getHisTextList,
    chatList,
    promptList,
    isNewChat,
    apiKeyList,
    getApiKeylList,

    getMaxTokenInit,
    getIsNewConversation,
    setConversationTitle,
  };
};
