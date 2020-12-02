import request from '@/utils/request'

export function getOrderTabs(params) {
  return request({
    url: '/order/order/tab-list',
    method: 'get',
    params
  })
}
