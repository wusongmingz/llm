import request from '@/utils/request';

export function getMqttData() {
  return request({
    url: '/influx/list/influx/data',
    method: 'get',
  });
}
